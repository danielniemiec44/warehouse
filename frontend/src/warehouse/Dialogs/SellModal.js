import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerTypes} from "../Reducers";
import { useWarehouse } from "../Pages/WarehouseIndex";
import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SquareTextField from "../Utils/SquareTextField";
import Stack from "@mui/material/Stack";
import {Link} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {t} from "i18next";
import Button from "@mui/material/Button";

function SellModal(){
    const saleItems = useSelector((state: RootReducerTypes) => state.warehouse.saleItems);
    const { data: warehouse, status } = useWarehouse(undefined, undefined, undefined, []);
    const dispatch = useDispatch();

    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant={'h6'}>Kompletowanie zamówienia - sprzedaż z magazynu</Typography>
            </DialogTitle>
            <DialogContent>
                {saleItems?.map((item, index) => {
                    const foundRow = warehouse?.warehouses?.find((row) => row?.id === item);

                    return (
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Stack direction={"row"} spacing={3} style={{ display: "flex", alignItems: "center" }}>
                                    <SquareTextField onClick={(e) => e.stopPropagation()} min={1} max={foundRow?.quantity ?? 0} defaultValue={1} />
                                    <Link component="button"
                                          variant="body2"
                                          onClick={(e) => { e.stopPropagation(); dispatch({ type: "SELECT_DISPLAY_CATEGORY_ROWS", payload: foundRow?.categoryId  }); dispatch({ type: "FILTER_ROWS", payload: {"name": foundRow?.name} }) }}>
                                              <Typography component="span">{foundRow?.name}  -  {foundRow?.barcode ?? "Nie przypisano kodu kreskowego"}</Typography></Link>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                {foundRow?.properties?.map((property) => {

                                    return (
                                        <Box>
                                            <Typography><b>{property?.customField?.name}:</b> {property?.PropertyValue}</Typography>
                                        </Box>
                                    )
                                })}
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { dispatch({ type: "CLOSE_COMPLETING_SALE_MODAL" }) }}>{t("dialogActions.cancel")}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SellModal;