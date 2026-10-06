import { useSelector } from "react-redux"
import type { RootState } from "./store/store"
import { Link } from "react-router-dom"

import { Button, Chip, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

function App() {
  const currentRestaurant = useSelector(
    (state: RootState) => state.restaurant.currentRestaurant
  );
  const products = useSelector(
    (state: RootState) => state.product.products
  )

  const availableProducts = products.filter(
    (product) =>
      product.is_available &&
      product.restaurant_id === currentRestaurant?.id
  )
  return (
    <main className="home">

      {/* HERO */}
      <section className="home-hero">
        <div className="home-container hero-content">

          <div className="hero-text">
            <Chip
              label="🍗 Ytasty Crousty"
              className="hero-badge"
            />

            <h1>
              Le croustillant
              <span> qui fait plaisir.</span>
            </h1>

            <p>
              Découvrez nos restaurants, choisissez vos plats
              préférés et commandez simplement.
            </p>

            <div className="hero-actions">
              <Button
                component={Link}
                to="/menu"
                variant="contained"
                className="btn-primary"
              >
                Découvrir le menu
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="home-section products-section">
        <div className="home-container">

          <div className="section-header">
            <div>
              <span className="section-label">
                NOS INCONTOURNABLES
              </span>

              <h2>
                Les favoris du moment
              </h2>

              <p>
                Découvrez une sélection de nos produits
                les plus appréciés.
              </p>
            </div>

            <Link
              to="/menu"
              className="section-link"
            >
              Voir le menu <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          <div className="product-grid">
            {availableProducts.slice(0, 4).map((product) => (
              <Link
                  to="/menu"
                className="product-card"
                key={`${product.restaurant_id}-${product.name}`}
              >
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />

                  <Chip
                    label={product.category}
                    size="small"
                    className="product-category"
                  />
                </div>

                <div className="product-content">
                  <div className="product-top">
                    <h3>{product.name}</h3>

                    <strong>
                      {product.price.toFixed(2)} €
                    </strong>
                  </div>

                  <p>
                    {product.description}
                  </p>

                  <div className="product-bottom">
                    <span>
                      {product.ingredients
                        .slice(0, 3)
                        .join(" · ")}
                    </span>

                    <IconButton
                      className="product-add"
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-container">

          <div className="cta-content">
            <div>
              <span className="section-label">
                ENVIE DE CROUSTILLANT ?
              </span>

              <h2>
                Votre prochaine commande
                commence ici.
              </h2>

              <p>
                Choisissez votre restaurant et profitez
                de nos recettes croustillantes.
              </p>
            </div>

            <Button
              component={Link}
              to="/menu"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              className="cta-button"
            >
              Commander maintenant
            </Button>
          </div>

        </div>
      </section>

    </main>
  )
}

export default App