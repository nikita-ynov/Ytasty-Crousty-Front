import { useState } from 'react';
import { 
  Drawer, Box, Typography, IconButton, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, Button, Divider, 
  ButtonGroup, Alert 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useCart } from '@/context/CartContext';
import { ordersService } from '@/services/ordersService';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('token') || '';

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      setError(null);

      const items = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const newOrder = await ordersService.createOrder({ items }, token);
      
      setOrderSuccess(`Commande #${newOrder.order_number} validée !`);
      clearCart();

      setTimeout(() => {
        setOrderSuccess(null);
        onClose();
      }, 2500);
    } catch {
      setError('Erreur lors de la validation de la commande.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBagOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Mon Panier
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {orderSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {orderSuccess}
          </Alert>
        )}

        {cart.length === 0 ? (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.6 }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 64, mb: 1 }} />
            <Typography variant="body1">Votre panier est vide</Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
              {cart.map(({ product, quantity }) => (
                <ListItem 
                  key={product.id}
                  disableGutters
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #f0f0f0' }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={product.image_url} 
                      alt={product.name} 
                      variant="rounded" 
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{product.name}</Typography>}
                    secondary={`${(product.price * quantity).toFixed(2)} €`}
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ButtonGroup size="small" variant="outlined">
                      <Button onClick={() => updateQuantity(product.id, quantity - 1)}>
                        <RemoveIcon fontSize="small" />
                      </Button>
                      <Button disabled sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {quantity}
                      </Button>
                      <Button onClick={() => updateQuantity(product.id, quantity + 1)}>
                        <AddIcon fontSize="small" />
                      </Button>
                    </ButtonGroup>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(product.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Total TTC</Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                  {totalPrice.toFixed(2)} €
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting || cart.length === 0}
              onClick={handleCheckout}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              {submitting ? 'Validation...' : 'Commander'}
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};