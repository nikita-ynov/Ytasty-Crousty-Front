import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import type { Restaurant } from "../types/restaurants";
import { setCurrentRestaurante } from "../store/reducers/restaurants";

export default function CityMenu() {
    const id = React.useId();

    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;

    const [anchorEl, setAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const dispatch = useDispatch();

    const handleClose = (restaurant: Restaurant) => {
        dispatch(setCurrentRestaurante(restaurant));
        setAnchorEl(null);
    };

    const currentRestaurant = useSelector((state: RootState) => state.restaurant.currentRestaurant)
    const restaurants = useSelector((state: RootState) => state.restaurant.restaurants)


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
                {
                    restaurants.map((restaurant, key) => {
                        return (
                            <MenuItem key={key} onClick={() => handleClose(restaurant)}>
                                {restaurant.city}
                            </MenuItem>
                        )

                    })
                }

                {/* <MenuItem onClick={handleClose}>
                    Aix-en-Provence
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    Paris
                </MenuItem> */}
            </Menu>
        </div>
    );
}