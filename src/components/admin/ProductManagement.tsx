import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Grid,
  CircularProgress, Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, FormControlLabel, Switch, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ProductCard } from '../products/ProductCard';
import type { Product, ProductCategory } from "../../types/product";
import { productsService } from "../../services/productsService";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'burgers', label: 'Burgers' },
  { value: 'sides', label: 'Accompagnements' },
  { value: 'drinks', label: 'Boissons' },
  { value: 'desserts', label: 'Desserts' },
];

const RESTAURANTS = [
  { id: '1', name: 'Aix-en-Provence' },
  { id: '2', name: 'Lyon' },
  { id: '3', name: 'Paris' },
];

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const userRole = localStorage.getItem('role') || 'staff'; // 'admin' ou 'staff'
  const userRestaurantId = localStorage.getItem('restaurant_id') || '1';

  const [formData, setFormData] = useState({
    restaurant_id: userRestaurantId,
    name: '',
    description: '',
    price: 0,
    category: 'burgers' as ProductCategory,
    ingredients: '',
    image_url: '',
    is_available: true,
  });


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch {
      setError('Erreur lors du chargement des produits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const updated = await productsService.toggleAvailability(id, !currentStatus);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch {
      setError('Impossible de modifier la disponibilité.');
    }
  };

  const handleDelete = async (id: string) => {
    if (userRole !== 'admin') return;
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await productsService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        restaurant_id: product.restaurant_id || userRestaurantId,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        ingredients: product.ingredients ? product.ingredients.join(', ') : '',
        image_url: product.image_url || '',
        is_available: product.is_available,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        restaurant_id: userRestaurantId,
        name: '',
        description: '',
        price: 0,
        category: 'burgers',
        ingredients: '',
        image_url: '',
        is_available: true,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ingredients: formData.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
      };

      if (editingProduct) {
        const updated = await productsService.updateProduct(editingProduct.id, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
      } else {
        const created = await productsService.createProduct(payload);
        setProducts((prev) => [...prev, created]);
      }
      handleCloseModal();
    } catch {
      setError('Erreur lors de la sauvegarde du produit.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gestion du Menu {userRole === 'staff' ? '(Staff)' : '(Admin)'}
        </Typography>
        {userRole === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ borderRadius: 2 }}
          >
            Nouveau produit
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard
                product={product}
                onToggleAvailability={handleToggleAvailability}
                onEdit={userRole === 'admin' ? handleOpenModal : undefined}
                onDelete={userRole === 'admin' ? handleDelete : undefined}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="Établissement"
              fullWidth
              required
              value={formData.restaurant_id}
              onChange={(e) => setFormData({ ...formData, restaurant_id: e.target.value })}
            >
              {RESTAURANTS.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>

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
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
            >
              {CATEGORIES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <TextField
              label="Ingrédients (séparés par des virgules)"
              placeholder="Pain brioché, Steak 150g, Cheddar, Sauce maison"
              fullWidth
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            />

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
              label="URL de l'image"
              fullWidth
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  color="success"
                />
              }
              label="Disponible à la vente"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal}>Annuler</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};