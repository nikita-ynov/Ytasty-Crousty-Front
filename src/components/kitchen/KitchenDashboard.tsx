import { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Tabs, Tab, Badge, Chip, CircularProgress } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import type { Order, OrderStatus } from "../../types/order";
import { ordersService } from "../../services/ordersService";
import SocketService from "../../services/socketService";
import { StatsCards } from './StatsCards';
import { OrderGrid } from './OrderGrid';
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export const KitchenDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('all');

  const currentRestaurant = useSelector(
      (state: RootState) => state.restaurant.currentRestaurant
  );

  const restaurantId = currentRestaurant?.id?.toString();

  useEffect(() => {
    const fetchOrders = async () => {

      if (!restaurantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ordersService.getRestaurantOrders(restaurantId);
        setOrders(data);
      } catch (err) {
        setError('Impossible de charger les commandes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const socketInstance = SocketService.getInstance().socket;

    setIsConnected(socketInstance.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onNewOrder = (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev]);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('newOrder', onNewOrder);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('newOrder', onNewOrder);
    };
  }, [restaurantId]);

  const handleStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    try {
      await ordersService.updateOrderStatus(orderNumber, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.order_number === orderNumber ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (currentTab === 'all') return true;
    return order.status === currentTab;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const revenue = orders.reduce((acc, o) => acc + (o.total_price || 0), 0);

  const handleCancelOrder = async (orderNumber: string) => {
    try {
      await ordersService.cancelOrder(orderNumber);

      setOrders((prev) =>
          prev.map((order) =>
              order.order_number === orderNumber
                  ? { ...order, status: "cancelled" }
                  : order
          )
      );
    } catch {
      setError("Erreur lors de l'annulation de la commande.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Cuisine - Dashboard
        </Typography>
        <Chip
          icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
          label={isConnected ? 'Connecté (Live)' : 'Hors ligne'}
          color={isConnected ? 'success' : 'error'}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <StatsCards 
        preparingCount={preparingCount} 
        readyCount={readyCount} 
        revenue={revenue} 
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4, mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="Toutes" 
            value="all" 
            icon={<Badge badgeContent={orders.length} color="primary"><Box sx={{ width: 12 }} /></Badge>} 
            iconPosition="end" 
          />
          <Tab 
            label="En attente" 
            value="pending" 
            icon={<Badge badgeContent={pendingCount} color="warning"><Box sx={{ width: 12 }} /></Badge>} 
            iconPosition="end" 
          />
          <Tab 
            label="En préparation" 
            value="preparing" 
            icon={<Badge badgeContent={preparingCount} color="info"><Box sx={{ width: 12 }} /></Badge>} 
            iconPosition="end" 
          />
          <Tab 
            label="Prêtes" 
            value="ready" 
            icon={<Badge badgeContent={readyCount} color="success"><Box sx={{ width: 12 }} /></Badge>} 
            iconPosition="end" 
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
          <OrderGrid
              orders={filteredOrders}
              onStatusChange={handleStatusChange}
              onCancelOrder={handleCancelOrder}
          />
      )}
    </Container>
  );
};