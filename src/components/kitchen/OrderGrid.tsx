import { Box, Grid, Typography } from "@mui/material";
import type { Order, OrderStatus } from "../../types/order";
import { OrderCard } from "./OrderCard";

interface OrderGridProps {
  orders: Order[];
  onStatusChange: (
      orderNumber: string,
      newStatus: OrderStatus
  ) => void;
  onCancelOrder: (orderNumber: string) => void;
}

export const OrderGrid = ({
                            orders,
                            onStatusChange,
                            onCancelOrder
                          }: OrderGridProps) => {
  if (orders.length === 0) {
    return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Aucune commande pour le moment
          </Typography>
        </Box>
    );
  }

  return (
      <Grid container spacing={3}>
        {orders.map((order) => (
            <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={order.order_number}
            >
              <OrderCard
                  order={order}
                  onStatusChange={onStatusChange}
                  onCancelOrder={onCancelOrder}
              />
            </Grid>
        ))}
      </Grid>
  );
};