import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import {useSelector} from "react-redux";
import {RootReducerTypes} from "../Reducers";
import { useWarehouse } from "../Pages/WarehouseIndex";

function SellModal(){
    const saleItems = useSelector((state: RootReducerTypes) => state.warehouse.saleItems);
    const { data: warehouse, status } = useWarehouse(undefined, undefined, undefined, []);

    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant={'h6'}>Kompletowanie zamówienia - sprzedaż z magazynu</Typography>
            </DialogTitle>
            <DialogContent>
                {saleItems?.map((item, index) => {
                    const foundRow = warehouse?.warehouses?.find((row) => row?.id === item);

                    return (
                        <div key={index}>
                            <Typography>{foundRow?.name} - {item?.quantity} szt.</Typography>
                        </div>
                    )
                })}
            </DialogContent>
        </Dialog>
    );
}

export default SellModal;