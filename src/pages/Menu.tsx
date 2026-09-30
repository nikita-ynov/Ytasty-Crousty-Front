import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Switch,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import type { Product } from "../types/products";


const API_URL = import.meta.env.VITE_API_URL;

const categories = [
    "Tous",
    "burgers",
    "boxes"
];

export default function Menu() {
    const currentRestaurant = useSelector(
        (state: RootState) => state.restaurant.currentRestaurant
    );

    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Tous");
    const [onlyAvailable, setOnlyAvailable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    /*
     * Récupère la recherche depuis l'URL
     * Exemple : /menu?q=burger
     */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");

        if (query) {
            setSearch(query);
        }
    }, []);

    /*
     * Charge les produits du restaurant sélectionné
     */
    useEffect(() => {
        if (!currentRestaurant?.id) {
            setProducts([]);
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/products/`
                );

                if (!response.ok) {
                    throw new Error("Impossible de récupérer les produits.");
                }

                const data = await response.json();

                const allProducts = Array.isArray(data)
                    ? data
                    : data.products ?? [];

                const availableProducts = allProducts.filter(
                    (product: Product) =>
                        product.restaurant_id === currentRestaurant?.id
                );

                setProducts(availableProducts);
            } catch (error) {
                console.error(error);
                setError("Impossible de charger les produits.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentRestaurant]);

    /*
     * Recherche + catégorie + disponibilité
     */
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                product.name.toLowerCase().includes(searchValue) ||
                product.description?.toLowerCase().includes(searchValue) ||
                product.ingredients?.some((ingredient) =>
                    ingredient.toLowerCase().includes(searchValue)
                );

            const matchesCategory =
                category === "Tous" ||
                product.category.toLowerCase() === category.toLowerCase();

            const matchesAvailability =
                !onlyAvailable || product.is_available;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesAvailability
            );
        });
    }, [products, search, category, onlyAvailable]);

    /*
     * Recherche dans l'URL
     */
    const handleSearch = (value: string) => {
        setSearch(value);

        const params = new URLSearchParams(window.location.search);

        if (value.trim()) {
            params.set("q", value);
        } else {
            params.delete("q");
        }

        const queryString = params.toString();

        window.history.replaceState(
            {},
            "",
            queryString ? `/menu?${queryString}` : "/menu"
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price);
    };

    return (
        <main className="menu-page">
            <section className="menu-hero">
                <div className="menu-container">

                    <div className="menu-hero-content">

                        <Chip
                            icon={<RestaurantIcon />}
                            label={
                                currentRestaurant
                                    ? currentRestaurant.name
                                    : "Restaurant"
                            }
                            className="menu-badge"
                        />

                        <h1>
                            Notre <span>menu</span>
                        </h1>

                        <p>
                            Découvrez tous nos produits croustillants
                            et composez votre commande selon vos envies.
                        </p>

                    </div>

                </div>
            </section>


            <section className="menu-controls-section">
                <div className="menu-container">

                    <div className="menu-controls">

                        <TextField
                            value={search}
                            onChange={(event) =>
                                handleSearch(event.target.value)
                            }
                            placeholder="Rechercher un produit..."
                            className="menu-search"
                            fullWidth
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <FormControlLabel
                            className="availability-toggle"
                            control={
                                <Switch
                                    checked={onlyAvailable}
                                    onChange={(event) =>
                                        setOnlyAvailable(event.target.checked)
                                    }
                                />
                            }
                            label="Disponibles uniquement"
                        />

                    </div>


                    <div className="category-list">

                        {categories.map((item) => (
                            <Button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={
                                    category === item
                                        ? "category-button active"
                                        : "category-button"
                                }
                            >
                                {item === "Tous"
                                    ? "Tous"
                                    : item.charAt(0).toUpperCase() +
                                    item.slice(1)}
                            </Button>
                        ))}

                    </div>

                </div>
            </section>


            <section className="menu-products-section">
                <div className="menu-container">

                    <div className="menu-section-header">

                        <div>
                            <span className="menu-section-label">
                                NOTRE SÉLECTION
                            </span>

                            <h2>
                                {category === "Tous"
                                    ? "Tous nos produits"
                                    : category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                            </h2>

                            <p>
                                {filteredProducts.length} produit
                                {filteredProducts.length > 1 ? "s" : ""}
                                disponible
                                {filteredProducts.length > 1 ? "s" : ""}
                            </p>
                        </div>

                    </div>


                    {!currentRestaurant && (
                        <Alert severity="info">
                            Sélectionnez un restaurant pour voir son menu.
                        </Alert>
                    )}


                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}


                    {loading && (
                        <div className="menu-loading">
                            <CircularProgress />
                        </div>
                    )}


                    {!loading && currentRestaurant && (
                        <div className="menu-product-grid">

                            {filteredProducts.map((product, key) => (
                                <Card
                                    key={key}
                                    className={
                                        product.is_available
                                            ? "menu-product-card"
                                            : "menu-product-card unavailable"
                                    }
                                    onClick={() =>
                                        setSelectedProduct(product)
                                    }
                                >

                                    <div className="menu-product-image">

                                        <CardMedia
                                            component="img"
                                            image={product.image}
                                            alt={product.name}
                                        />

                                        <Chip
                                            label={product.category}
                                            size="small"
                                            className="menu-product-category"
                                        />

                                        {!product.is_available && (
                                            <div className="product-unavailable-overlay">
                                                <span>
                                                    Indisponible
                                                </span>
                                            </div>
                                        )}

                                    </div>

                                    <CardContent className="menu-product-content">

                                        <div className="menu-product-top">

                                            <h3>
                                                {product.name}
                                            </h3>

                                            <strong>
                                                {formatPrice(product.price)}
                                            </strong>

                                        </div>

                                        <p className="menu-product-description">
                                            {product.description}
                                        </p>

                                        <div className="menu-product-ingredients">
                                            {product.ingredients
                                                ?.slice(0, 3)
                                                .map((ingredient) => (
                                                    <span key={ingredient}>
                                                        {ingredient}
                                                    </span>
                                                ))}
                                        </div>

                                        <div className="menu-product-bottom">

                                            <Chip
                                                label={
                                                    product.is_available
                                                        ? "Disponible"
                                                        : "Indisponible"
                                                }
                                                size="small"
                                                className={
                                                    product.is_available
                                                        ? "availability-chip available"
                                                        : "availability-chip unavailable"
                                                }
                                            />

                                            <IconButton
                                                className="menu-add-button"
                                                disabled={!product.is_available}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>

                                        </div>

                                    </CardContent>

                                </Card>
                            ))}

                        </div>
                    )}


                    {!loading &&
                        currentRestaurant &&
                        filteredProducts.length === 0 && (
                            <div className="menu-empty">

                                <SearchIcon />

                                <h3>
                                    Aucun produit trouvé
                                </h3>

                                <p>
                                    Essayez une autre recherche ou
                                    modifiez vos filtres.
                                </p>

                            </div>
                        )}

                </div>
            </section>


            <Dialog
                open={Boolean(selectedProduct)}
                onClose={() => setSelectedProduct(null)}
                fullWidth
                maxWidth="sm"
                className="product-dialog"
            >

                {selectedProduct && (
                    <>
                        <DialogTitle className="product-dialog-title">

                            <span>
                                {selectedProduct.name}
                            </span>

                            <IconButton
                                onClick={() => setSelectedProduct(null)}
                            >
                                <CloseIcon />
                            </IconButton>

                        </DialogTitle>

                        <DialogContent className="product-dialog-content">

                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="product-dialog-image"
                            />

                            <div className="product-dialog-info">

                                <div className="product-dialog-header">

                                    <Chip
                                        label={selectedProduct.category}
                                        size="small"
                                    />

                                    <strong>
                                        {formatPrice(
                                            selectedProduct.price
                                        )}
                                    </strong>

                                </div>

                                <p>
                                    {selectedProduct.description}
                                </p>

                                <h4>
                                    Ingrédients
                                </h4>

                                <div className="dialog-ingredients">
                                    {selectedProduct.ingredients?.map(
                                        (ingredient) => (
                                            <Chip
                                                key={ingredient}
                                                label={ingredient}
                                                size="small"
                                                variant="outlined"
                                            />
                                        )
                                    )}
                                </div>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={
                                        !selectedProduct.is_available
                                    }
                                    className="dialog-add-button"
                                    startIcon={<AddIcon />}
                                >
                                    {selectedProduct.is_available
                                        ? "Ajouter au panier"
                                        : "Produit indisponible"}
                                </Button>

                            </div>

                        </DialogContent>
                    </>
                )}

            </Dialog>

        </main>
    );
}