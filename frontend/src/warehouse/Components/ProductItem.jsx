import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import SquareButton from "../Utils/SquareButton";
import TextField from "@mui/material/TextField";
import {Link} from "react-router-dom";
import Typography from "@mui/material/Typography";
import React from "react";
import {useDispatch} from "react-redux";
import {useWarehouse} from "../Pages/WarehouseIndex";
import {useCategories} from "../Dialogs/CategoriesDialog";


const ProductItem = ({ changeQuantityByButton, item, updateQuantity }) => {
    const dispatch = useDispatch();
    const { data: warehouse, status } = useWarehouse(undefined, undefined, undefined, null);
    const { data: categories, status: categoriesStatus } = useCategories();
    const foundRow = warehouse?.warehouses?.find((row) => {
        if(item?.productId) return row?.id === item?.productId;
        else if(item?.id) return row?.id === item?.id;
        else return false;

    });


    return (
        <Accordion defaultExpanded>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Stack direction={"row"} spacing={3} style={{ display: "flex", alignItems: "center" }}>
                    <Stack direction={"row"} spacing={1} style={{ display: "flex", alignItems: "center" }}>
                        {changeQuantityByButton && updateQuantity && (
                            <SquareButton size={30} style={{ fontSize: 25 }} onClick={(e) => {
                                e.stopPropagation();
                                changeQuantityByButton(item, -1)
                            }}>-</SquareButton>
                        )}

                        <TextField onClick={(e) => {
                            e.stopPropagation();
                        }}
                                   min={0}
                                   max={foundRow?.quantity ?? 0}
                                   onChange={(e) => {
                                       updateQuantity && updateQuantity(item, e.target.value);
                                   }}
                                   value={item.quantity}
                                   style={{ width: 80 }} type={"number"}
                        />
                        {changeQuantityByButton && updateQuantity && (
                        <SquareButton size={30} style={{ fontSize: 20 }} onClick={(e) => {
                            e.stopPropagation();
                            changeQuantityByButton(item, 1)
                        }}>+</SquareButton>
                        )}
                    </Stack>
                    <Link component="button"
                          variant="body2"
                          onClick={(e) => { e.stopPropagation(); dispatch({ type: "SELECT_DISPLAY_CATEGORY_ROWS", payload: foundRow?.categoryId  }); dispatch({ type: "FILTER_ROWS", payload: {"name": foundRow?.name} }) }}>
                        <Stack>
                            <Typography component="span">{foundRow?.name}  -  {foundRow?.barcode ?? "Nie przypisano kodu kreskowego"}</Typography>
                            <Typography variant={"secondary"}>Kategoria: <b>{categories?.find((category) => category.id === foundRow?.categoryId)?.name ?? "Nie przypisano kategorii"}</b> - #{foundRow?.categoryId}</Typography>

                        </Stack>
                    </Link>
                    </Stack>
            </AccordionSummary>
            <AccordionDetails>
                {foundRow?.properties?.map((property, index) => {

                    return (
                        <Box key={`property-index-${index}`}>
                            <Typography><b>{property?.customField?.name}:</b> {property?.PropertyValue}</Typography>
                        </Box>
                    )
                })}
            </AccordionDetails>
        </Accordion>
    )
}

export default ProductItem;