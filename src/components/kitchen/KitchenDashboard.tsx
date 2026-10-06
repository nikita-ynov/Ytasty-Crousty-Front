import { useEffect, useState } from "react";

import {
    Alert,
    Badge,
    Box,
    Button,
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

import {
    useDispatch,
    useSelector
} from "react-redux";

import type { RootState } from "../../store/store";
import type {
    Order,
    OrderStatus
} from "../../types/order";

import {
    setCurrentRestaurante,
    setRestaurants
} from "../../store/reducers/restaurants";

import api from "../../services/api";
import { ordersService } from "../../services/ordersService";
import SocketService from "../../services/socketService";

import { StatsCards } from "./StatsCards";
import { OrderGrid } from "./OrderGrid";


export const KitchenDashboard = () => {
    const dispatch = useDispatch();

    const [orders, setOrders] =
        useState<Order[]>([]);

    const [error, setError] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [isConnected, setIsConnected] =
        useState(false);

    const [currentTab, setCurrentTab] =
        useState("all");

    const [
        newOrderNotification,
        setNewOrderNotification
    ] = useState(false);

    const [
        availabilityLoading,
        setAvailabilityLoading
    ] = useState(false);


    const currentRestaurant = useSelector(
        (state: RootState) =>
            state.restaurant.currentRestaurant
    );

    const restaurants = useSelector(
        (state: RootState) =>
            state.restaurant.restaurants
    );

    const role = useSelector(
        (state: RootState) =>
            state.auth.role
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
                    await ordersService
                        .getRestaurantOrders(
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

        const socket =
            socketService.socket;


        const onConnect = () => {
            setIsConnected(true);
        };


        const onDisconnect = () => {
            setIsConnected(false);
        };


        const onNewOrder = (
            newOrder: Order
        ) => {
            if (
                !restaurantId ||
                String(
                    newOrder.restaurant_id
                ) !== restaurantId
            ) {
                return;
            }


            setOrders(
                (previousOrders) => {
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
                }
            );

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

        setIsConnected(
            socket.connected
        );


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
            await ordersService
                .updateOrderStatus(
                    orderNumber,
                    newStatus
                );


            setOrders(
                (previousOrders) =>
                    previousOrders.map(
                        (order) =>
                            order.order_number ===
                            orderNumber
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


            setOrders(
                (previousOrders) =>
                    previousOrders.map(
                        (order) =>
                            order.order_number ===
                            orderNumber
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


    const handleRestaurantAvailability =
        async () => {

            if (!currentRestaurant) {
                return;
            }


            try {
                setAvailabilityLoading(true);
                setError(null);


                const response =
                    await api.patch(
                        `/restaurants/${currentRestaurant.id}/availability`,
                        {
                            is_open:
                                !currentRestaurant.is_open
                        }
                    );


                const updatedRestaurant =
                    response.data;


                dispatch(
                    setCurrentRestaurante(
                        updatedRestaurant
                    )
                );


                dispatch(
                    setRestaurants(
                        restaurants.map(
                            (restaurant) =>
                                restaurant.id ===
                                updatedRestaurant.id
                                    ? updatedRestaurant
                                    : restaurant
                        )
                    )
                );

            } catch {
                setError(
                    "Impossible de modifier l'état du restaurant."
                );

            } finally {
                setAvailabilityLoading(false);
            }
        };


    const filteredOrders =
        orders.filter(
            (order) => {
                if (
                    currentTab === "all"
                ) {
                    return true;
                }

                return (
                    order.status ===
                    currentTab
                );
            }
        );


    const pendingCount =
        orders.filter(
            (order) =>
                order.status ===
                "pending"
        ).length;


    const preparingCount =
        orders.filter(
            (order) =>
                order.status ===
                "preparing"
        ).length;


    const readyCount =
        orders.filter(
            (order) =>
                order.status ===
                "ready"
        ).length;


    const revenue =
        orders.reduce(
            (total, order) =>
                total +
                (
                    order.total_price ||
                    0
                ),
            0
        );


    return (
        <Container
            maxWidth="xl"
            sx={{ py: 4 }}
        >

            {/* NOTIFICATION NOUVELLE COMMANDE */}

            <Snackbar
                open={
                    newOrderNotification
                }
                autoHideDuration={4000}
                onClose={() =>
                    setNewOrderNotification(
                        false
                    )
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    onClose={() =>
                        setNewOrderNotification(
                            false
                        )
                    }
                >
                    Nouvelle commande reçue !
                </Alert>
            </Snackbar>


            {/* HEADER DASHBOARD */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 3
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700
                    }}
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
                    sx={{
                        fontWeight: 600
                    }}
                />

            </Box>


            {/* GESTION RESTAURANT ADMIN */}

            {role === "admin" &&
                currentRestaurant && (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between",
                            flexWrap:
                                "wrap",
                            gap: 2,

                            mb: 3,
                            p: 2.5,

                            borderRadius: 3,

                            background:
                                "var(--color-surface)",

                            border:
                                "1px solid var(--color-border-subtle)",

                            boxShadow:
                                "0 2px 8px rgba(160, 65, 0, 0.08)"
                        }}
                    >

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight:
                                        700
                                }}
                            >
                                {
                                    currentRestaurant.name
                                }{" "}
                                -{" "}
                                {
                                    currentRestaurant.city
                                }
                            </Typography>


                            <Chip
                                label={
                                    currentRestaurant.is_open
                                        ? "Restaurant ouvert"
                                        : "Restaurant fermé"
                                }
                                color={
                                    currentRestaurant.is_open
                                        ? "success"
                                        : "error"
                                }
                                size="small"
                                sx={{
                                    mt: 1,
                                    fontWeight:
                                        600
                                }}
                            />

                        </Box>


                        <Button
                            variant="contained"
                            disabled={
                                availabilityLoading
                            }
                            onClick={
                                handleRestaurantAvailability
                            }
                            sx={{
                                borderRadius:
                                    "999px",

                                textTransform:
                                    "none",

                                fontWeight:
                                    600,

                                px: 3,

                                background:
                                    currentRestaurant.is_open
                                        ? "var(--color-error)"
                                        : "var(--color-primary)",

                                "&:hover": {
                                    background:
                                        currentRestaurant.is_open
                                            ? "var(--color-error)"
                                            : "var(--color-primary)",

                                    opacity:
                                        0.9
                                }
                            }}
                        >
                            {
                                availabilityLoading
                                    ? "Modification..."
                                    : currentRestaurant.is_open
                                        ? "Fermer le restaurant"
                                        : "Ouvrir le restaurant"
                            }
                        </Button>

                    </Box>
                )}


            {/* ERREURS */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
                    onClose={() =>
                        setError(null)
                    }
                >
                    {error}
                </Alert>
            )}


            {/* STATISTIQUES */}

            <StatsCards
                preparingCount={
                    preparingCount
                }
                readyCount={
                    readyCount
                }
                revenue={
                    revenue
                }
            />


            {/* FILTRES COMMANDES */}

            <Box
                sx={{
                    borderBottom: 1,
                    borderColor:
                        "divider",
                    mt: 4,
                    mb: 3
                }}
            >

                <Tabs
                    value={
                        currentTab
                    }
                    onChange={(
                        _,
                        newValue
                    ) =>
                        setCurrentTab(
                            newValue
                        )
                    }
                    variant="scrollable"
                    scrollButtons="auto"
                >

                    <Tab
                        label="Toutes"
                        value="all"
                        icon={
                            <Badge
                                badgeContent={
                                    orders.length
                                }
                                color="primary"
                            >
                                <Box
                                    sx={{
                                        width: 12
                                    }}
                                />
                            </Badge>
                        }
                        iconPosition="end"
                    />


                    <Tab
                        label="En attente"
                        value="pending"
                        icon={
                            <Badge
                                badgeContent={
                                    pendingCount
                                }
                                color="warning"
                            >
                                <Box
                                    sx={{
                                        width: 12
                                    }}
                                />
                            </Badge>
                        }
                        iconPosition="end"
                    />


                    <Tab
                        label="En préparation"
                        value="preparing"
                        icon={
                            <Badge
                                badgeContent={
                                    preparingCount
                                }
                                color="info"
                            >
                                <Box
                                    sx={{
                                        width: 12
                                    }}
                                />
                            </Badge>
                        }
                        iconPosition="end"
                    />


                    <Tab
                        label="Prêtes"
                        value="ready"
                        icon={
                            <Badge
                                badgeContent={
                                    readyCount
                                }
                                color="success"
                            >
                                <Box
                                    sx={{
                                        width: 12
                                    }}
                                />
                            </Badge>
                        }
                        iconPosition="end"
                    />

                </Tabs>

            </Box>


            {/* COMMANDES */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "center",
                        py: 8
                    }}
                >
                    <CircularProgress />
                </Box>

            ) : (

                <OrderGrid
                    orders={
                        filteredOrders
                    }
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