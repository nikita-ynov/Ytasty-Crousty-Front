import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Restaurant } from "../types/restaurants";
import { setCurrentRestaurante } from "../store/reducers/restaurants";

export default function CityMenu() {
    const id = React.useId();

    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;

    const [anchorEl, setAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const dispatch = useDispatch();

    const currentRestaurant = useSelector(
        (state: RootState) => state.restaurant.currentRestaurant
    );

    const restaurants = useSelector(
        (state: RootState) => state.restaurant.restaurants
    );

    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (restaurant: Restaurant) => {
        // Un restaurant fermé ne peut pas être sélectionné
        if (!restaurant.is_open) {
            return;
        }

        dispatch(setCurrentRestaurante(restaurant));
        setAnchorEl(null);
    };

    return (
        <div className="city-menu">
            <Button
                id={buttonId}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={handleClick}
                className="city-button"
                startIcon={<LocationOnIcon />}
            >
                {currentRestaurant?.city}
            </Button>

            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        "aria-labelledby": buttonId,
                    },
                }}
            >
                {restaurants.map((restaurant) => (
                    <MenuItem
                        key={restaurant.id}
                        onClick={() => handleSelect(restaurant)}
                        disabled={!restaurant.is_open}
                    >
                        <span>{restaurant.city}</span>

                        <Chip
                            label={
                                restaurant.is_open
                                    ? "Ouvert"
                                    : "Fermé"
                            }
                            size="small"
                            color={
                                restaurant.is_open
                                    ? "success"
                                    : "default"
                            }
                            sx={{
                                ml: 2,
                                fontSize: "0.7rem",
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}