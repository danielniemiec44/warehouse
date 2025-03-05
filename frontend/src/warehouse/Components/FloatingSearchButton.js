import React, { useState } from "react";
import {Button, TextField, Popover, Checkbox} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const FloatingSearchButton = ({ type = "tex" }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Button onClick={handleClick}>
                <FilterAltIcon />
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                { type === "text" && (
                    <TextField
                        autoFocus
                        size="small"
                        variant="outlined"
                        placeholder="Enter search..."
                        style={{ margin: 10 }}
                    />
                )}

                { type === "number" && (
                    <TextField
                        autoFocus
                        size="small"
                        variant="outlined"
                        placeholder="Enter search..."
                        style={{ margin: 10 }}
                        type={"number"}
                    />
                )}

                { type === "checkbox" && (
                    <Checkbox
                        color="primary"
                        style={{ margin: 10 }}
                    />
                )}

            </Popover>
        </div>
    );
};

export default FloatingSearchButton;
