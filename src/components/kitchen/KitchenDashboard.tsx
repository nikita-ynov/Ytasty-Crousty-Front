import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Container,
  Snackbar,
  Tab,
  Tabs,
  Typography
} from "@mui/material";

import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";

import { useSelector } from "react-redux";

import type { RootState } from "../../store/store";
import type { Order, OrderStatus } from "../../types/order";

import { ordersService } from "../../services/ordersService";
import SocketService from "../../services/socketService";

import { StatsCards } from "./StatsCards";
import { OrderGrid } from "./OrderGrid";


export const KitchenDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");

  const [newOrderNotification, setNewOrderNotification] =
      useState(false);

  const currentRestaurant = useSelector(
      (state: RootState) =>
          state.restaurant.currentRestaurant
  );

  const restaurantId =
      currentRestaurant?.id?.toString();


  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data =
            await ordersService.getRestaurantOrders(
                restaurantId
            );

        setOrders(data);
      } catch {
        setError(
            "Impossible de charger les commandes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();


    const socketService =
        SocketService.getInstance();

    const socket = socketService.socket;


    const onConnect = () => {
      setIsConnected(true);
    };


    const onDisconnect = () => {
      setIsConnected(false);
    };


    const onNewOrder = (newOrder: Order) => {
      if (
          !restaurantId ||
          String(newOrder.restaurant_id) !== restaurantId
      ) {
        return;
      }

      setOrders((previousOrders) => {
        const alreadyExists =
            previousOrders.some(
                (order) =>
                    order.order_number ===
                    newOrder.order_number
            );

        if (alreadyExists) {
          return previousOrders;
        }

        return [
          newOrder,
          ...previousOrders
        ];
      });

      setNewOrderNotification(true);
    };


    socket.on(
        "connect",
        onConnect
    );

    socket.on(
        "disconnect",
        onDisconnect
    );

    socket.on(
        "new_order",
        onNewOrder
    );


    socketService.connect();

    setIsConnected(socket.connected);


    return () => {
      socket.off(
          "connect",
          onConnect
      );

      socket.off(
          "disconnect",
          onDisconnect
      );

      socket.off(
          "new_order",
          onNewOrder
      );

      socketService.disconnect();
    };
  }, [restaurantId]);


  const handleStatusChange = async (
      orderNumber: string,
      newStatus: OrderStatus
  ) => {
    try {
      await ordersService.updateOrderStatus(
          orderNumber,
          newStatus
      );

      setOrders((previousOrders) =>
          previousOrders.map((order) =>
              order.order_number === orderNumber
                  ? {
                    ...order,
                    status: newStatus
                  }
                  : order
          )
      );
    } catch {
      setError(
          "Erreur lors de la mise à jour du statut."
      );
    }
  };


  const handleCancelOrder = async (
      orderNumber: string
  ) => {
    try {
      await ordersService.cancelOrder(
          orderNumber
      );

      setOrders((previousOrders) =>
          previousOrders.map((order) =>
              order.order_number === orderNumber
                  ? {
                    ...order,
                    status: "cancelled"
                  }
                  : order
          )
      );
    } catch {
      setError(
          "Erreur lors de l'annulation de la commande."
      );
    }
  };


  const filteredOrders =
      orders.filter((order) => {
        if (currentTab === "all") {
          return true;
        }

        return order.status === currentTab;
      });


  const pendingCount =
      orders.filter(
          (order) => order.status === "pending"
      ).length;


  const preparingCount =
      orders.filter(
          (order) => order.status === "preparing"
      ).length;


  const readyCount =
      orders.filter(
          (order) => order.status === "ready"
      ).length;


  const revenue =
      orders.reduce(
          (total, order) =>
              total + (order.total_price || 0),
          0
      );


  return (
      <Container
          maxWidth="xl"
          sx={{ py: 4 }}
      >
        <Snackbar
            open={newOrderNotification}
            autoHideDuration={4000}
            onClose={() =>
                setNewOrderNotification(false)
            }
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
        >
          <Alert
              severity="success"
              onClose={() =>
                  setNewOrderNotification(false)
              }
          >
            Nouvelle commande reçue !
          </Alert>
        </Snackbar>


        <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3
            }}
        >
          <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
          >
            Cuisine - Dashboard
          </Typography>

          <Chip
              icon={
                isConnected
                    ? <WifiIcon />
                    : <WifiOffIcon />
              }
              label={
                isConnected
                    ? "Connecté (Live)"
                    : "Hors ligne"
              }
              color={
                isConnected
                    ? "success"
                    : "error"
              }
              variant="outlined"
              sx={{ fontWeight: 600 }}
          />
        </Box>


        {error && (
            <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() =>
                    setError(null)
                }
            >
              {error}
            </Alert>
        )}


        <StatsCards
            preparingCount={preparingCount}
            readyCount={readyCount}
            revenue={revenue}
        />


        <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mt: 4,
              mb: 3
            }}
        >
          <Tabs
              value={currentTab}
              onChange={(_, newValue) =>
                  setCurrentTab(newValue)
              }
              variant="scrollable"
              scrollButtons="auto"
          >
            <Tab
                label="Toutes"
                value="all"
                icon={
                  <Badge
                      badgeContent={orders.length}
                      color="primary"
                  >
                    <Box sx={{ width: 12 }} />
                  </Badge>
                }
                iconPosition="end"
            />

            <Tab
                label="En attente"
                value="pending"
                icon={
                  <Badge
                      badgeContent={pendingCount}
                      color="warning"
                  >
                    <Box sx={{ width: 12 }} />
                  </Badge>
                }
                iconPosition="end"
            />

            <Tab
                label="En préparation"
                value="preparing"
                icon={
                  <Badge
                      badgeContent={preparingCount}
                      color="info"
                  >
                    <Box sx={{ width: 12 }} />
                  </Badge>
                }
                iconPosition="end"
            />

            <Tab
                label="Prêtes"
                value="ready"
                icon={
                  <Badge
                      badgeContent={readyCount}
                      color="success"
                  >
                    <Box sx={{ width: 12 }} />
                  </Badge>
                }
                iconPosition="end"
            />
          </Tabs>
        </Box>


        {loading ? (
            <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 8
                }}
            >
              <CircularProgress />
            </Box>
        ) : (
            <OrderGrid
                orders={filteredOrders}
                onStatusChange={
                  handleStatusChange
                }
                onCancelOrder={
                  handleCancelOrder
                }
            />
        )}
      </Container>
  );
};