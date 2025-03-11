import React, {useEffect} from 'react';
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
import SquareButton from "../Utils/SquareButton";

function SellModal(){
    const saleItems = useSelector((state: RootReducerTypes) => state.warehouse.saleItems);
    const { data: warehouse, status } = useWarehouse(undefined, undefined, undefined, []);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Sale items: ", saleItems);
    }, [saleItems]);

    const changeQuantityByButton = (item: any, value: number) => {
        const updatedPayload = saleItems?.map((currentItem) => {
            if (currentItem.id === item.id) {
                const newQuantity = Number(currentItem.quantity) + value;
                if(newQuantity < 1) return currentItem;
                if(newQuantity > warehouse?.warehouses?.find((row) => row?.id === item?.id)?.quantity) return currentItem;
                return { ...currentItem, quantity: newQuantity };
            }
            return currentItem;
        });

        dispatch({
            type: "OPEN_COMPLETING_SALE_MODAL",
            payload: updatedPayload
        });
    }

    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant={'h6'}>Kompletowanie zamówienia - sprzedaż z magazynu</Typography>
            </DialogTitle>
            <DialogContent>
                {saleItems?.map((item, index) => {
                    const foundRow = warehouse?.warehouses?.find((row) => row?.id === item?.id);

                    return (
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Stack direction={"row"} spacing={3} style={{ display: "flex", alignItems: "center" }}>
                                    <Stack direction={"row"} spacing={1} style={{ display: "flex", alignItems: "center" }}>
                                        <SquareButton size={30} style={{ fontSize: 25 }} onClick={(e) => {
                                            e.stopPropagation();
                                            changeQuantityByButton(item, -1)
                                        }}>-</SquareButton>
                                        <SquareTextField onClick={(e) => {
                                            e.stopPropagation();
                                        }} min={1} max={foundRow?.quantity ?? 0} defaultValue={1} onChange={(e) => {

                                            const updatedPayload = saleItems?.map((currentItem) => {
                                                if (currentItem.id === item.id) {
                                                    return { ...currentItem, quantity: Number(e.target.value) };
                                                }
                                                return currentItem;
                                            });

                                            dispatch({
                                                type: "OPEN_COMPLETING_SALE_MODAL",
                                                payload: updatedPayload
                                            });
                                        }}
                                        value={item?.quantity}
                                        />
                                        <SquareButton size={30} style={{ fontSize: 20 }} onClick={(e) => {
                                            e.stopPropagation();
                                            changeQuantityByButton(item, 1)
                                        }}>+</SquareButton>
                                    </Stack>
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