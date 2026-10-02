import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import type { Product, ProductCategory } from '@/types/product';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id'>) => void;
  initialData?: Product | null;
}

const CATEGORIES: ProductCategory[] = ['burgers', 'sides', 'drinks', 'desserts'];

export const ProductModal = ({ open, onClose, onSubmit, initialData }: ProductModalProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    restaurant_id: '1',
    name: '',
    category: 'burgers',
    price: 0,
    description: '',
    ingredients: [],
    image_url: '',
    is_available: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        restaurant_id: initialData.restaurant_id || '1',
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        description: initialData.description,
        ingredients: initialData.ingredients || [],
        image_url: initialData.image_url || '',
        is_available: initialData.is_available,
      });
    } else {
      setFormData({
        restaurant_id: '1',
        name: '',
        category: 'burgers',
        price: 0,
        description: '',
        ingredients: [],
        image_url: '',
        is_available: true,
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nom du produit"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              select
              label="Catégorie"
              fullWidth
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
  label="Prix (€)"
  type="number"
  slotProps={{
    htmlInput: { step: '0.01' }
  }}
  fullWidth
  required
  value={formData.price}
  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
/>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="URL de l'image"
              fullWidth
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};