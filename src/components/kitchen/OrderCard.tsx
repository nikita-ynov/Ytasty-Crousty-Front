import { Card, CardContent, Typography, Box, Button, Chip, Divider, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Order, OrderStatus } from '../../types/order';
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderNumber: string, newStatus: OrderStatus) => void;
  onCancelOrder?: (orderNumber: string) => void;
}

export const OrderCard = ({ order, onStatusChange, onCancelOrder }: OrderCardProps) => {
  const restaurants = useSelector(
      (state: RootState) => state.restaurant.restaurants
  );

  const restaurant = restaurants.find(
      (restaurant) => restaurant.id === order.restaurant_id
  );
  const minutesElapsed = Math.floor(
    (new Date().getTime() - new Date(order.created_at).getTime()) / 60000
  );
  const isDelayed = order.status === 'pending' && minutesElapsed >= 15;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'info';
      case 'ready':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'preparing':
        return 'En préparation';
      case 'ready':
        return 'Prête';
      case 'collected':
        return 'Récupérée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <Card 
      sx={{ 
        borderRadius: 3, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
        bgcolor: '#fff',
        borderLeft: isDelayed ? '6px solid #d32f2f' : 'none' 
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            #{order.order_number}
          </Typography>
          <Chip 
            label={getStatusLabel(order.status)} 
            color={getStatusColor(order.status)} 
            size="small" 
            sx={{ fontWeight: 600 }}
          />
          <Chip
              label={
                restaurant
                    ? `${restaurant.name} - ${restaurant.city}`
                    : `Restaurant #${order.restaurant_id}`
              }
              size="small"
              variant="outlined"
              sx={{
                mb: 1.5,
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                fontWeight: 600
              }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: isDelayed ? 'error.main' : 'text.secondary' }}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: isDelayed ? 700 : 400 }}>
              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({minutesElapsed} min)
            </Typography>
          </Box>
          {order.pickup_mode && (
              <Chip
                  label={
                    order.pickup_mode === "onsite"
                        ? "Sur place"
                        : "À emporter"
                  }
                  size="small"
                  variant="outlined"
              />
          )}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1} sx={{ my: 2 }}>
          {order.items.map((item) => (
              <Box
                  key={item.product_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}
              >
                <Typography variant="body2">
                  {item.quantity} × Produit #{item.product_id}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                  {(item.unit_price * item.quantity).toFixed(2)} €
                </Typography>
              </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {order.status === 'pending' && (
            <Button
              fullWidth
              variant="contained"
              color="info"
              onClick={() => onStatusChange(order.order_number, 'preparing')}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Lancer la préparation
            </Button>
          )}

          {order.status === 'preparing' && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => onStatusChange(order.order_number, 'ready')}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Marquer comme prête
            </Button>
          )}

          {order.status !== 'ready' && order.status !== 'cancelled' && onCancelOrder && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => onCancelOrder(order.order_number)}
              sx={{ borderRadius: 2 }}
            >
              <CancelIcon fontSize="small" />
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};