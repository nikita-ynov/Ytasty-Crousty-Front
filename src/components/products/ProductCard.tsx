import { Card, CardContent, CardMedia, Typography, Box, Switch, FormControlLabel, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onToggleAvailability: (id: string, currentStatus: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onToggleAvailability, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 2 }}>
      <CardMedia
        component="img"
        height="160"
        image={product.image_url || 'https://via.placeholder.com/300x160?text=No+Image'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {product.name}
            </Typography>
            <Chip 
              label={`${product.price.toFixed(2)} €`} 
              color="primary" 
              sx={{ fontWeight: 'bold' }} 
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #eee' }}>
          <FormControlLabel
            control={
              <Switch
                checked={product.is_available}
                onChange={() => onToggleAvailability(product.id, product.is_available)}
                color="success"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {product.is_available ? 'Disponible' : 'Rupture'}
              </Typography>
            }
          />
          <Box>
            <IconButton size="small" onClick={() => onEdit(product)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(product.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};