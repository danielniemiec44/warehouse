import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/material/Typography";
import {CustomFetch} from "../Utils/CustomFetch";
import eventEmitter from "../Utils/eventEmitter";

export default function NewDeliveryDialog() {
    const showAddDeliveryModal = useSelector((state) => state.warehouse.showAddDeliveryModal);
    const dispatch = useDispatch();

    const[product, setProduct] = React.useState([]);
    const[category, setCategory] = React.useState([]);
    const[data, setData] = React.useState([]);

    const handleClose = () => {
        dispatch({type: 'CLOSE_ADD_DELIVERY_MODAL'});
    }

    const getDeliveryData = useCallback((event) => {
        event.preventDefault();
        CustomFetch(
            "deliveryData",
            "POST",
            { // wysyłka danych
                product,
                category
            },
            (data) => { //odbiór danych
                setData(data);
            }
        );
    }, [category, product]);

return (
    <Dialog
        open={showAddDeliveryModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Dodaj nową dostawę
        </DialogTitle>
        <DialogContent>
            <Typography variant={'body1'} sx={{marginBottom: "5px"}}>Pamiętaj aby przedmioty z każdej kategorii dodawać osobno. Jeśli np. dodasz aromat jako baza nikotynowa
            zostanie on tak zapisany.</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                    <Autocomplete
                        disablePortal
                        options={product}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Nazwa produktu" />}
                    />
                </Grid>
                <Grid item xs={12} lg={12}>
                    <Autocomplete
                        disablePortal
                        multiple
                        options={category}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Kategoria" />}
                    />
                </Grid>

                <Grid item xs={12} lg={12}>
                    <TextField
                        label="Ilość"
                        type="number"
                        fullWidth
                    />
                </Grid>

            </Grid>

        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color={"error"}>Zamknij okno (bez zapisywania)</Button>
            <Button onClick={handleClose} autoFocus variant={"contained"}>
                Dodaj dostawę
            </Button>
        </DialogActions>
    </Dialog>
)}