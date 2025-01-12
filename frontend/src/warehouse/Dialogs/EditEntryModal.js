import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {CustomFetch} from "../Utils/CustomFetch";
import {FormControl, InputLabel, LinearProgress, MenuItem, Select, Skeleton} from "@mui/material";
import {useQuery} from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import Stack from "@mui/material/Stack";
import LoadingIndicator from "../Utils/LoadingIndicator";
import {useTranslation} from "react-i18next";
import FetchedSelect from "../Utils/FetchedSelect.tsx";

export default function EditEntryModal() {
    const editEntryId = useSelector((state) => state.delivery.editEntryId);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const getWarehouseDataByID = async () => {
        const data = await CustomFetchForUseQuery(`warehouse/${editEntryId}`, "GET", null);
        console.log(data);
        return data;
    };

    const { data: warehouseData, isLoading: isLoadingDataFetch, isError: isErrorDataFetch } = useQuery(["warehouseData", editEntryId], getWarehouseDataByID);

    const handleClose = () => {
        dispatch({type: 'CLOSE_EDIT_DELIVERY_MODAL'});
    }

    return(
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Edytuj wpis
            </DialogTitle>
            <DialogContent>
                {( isLoadingDataFetch) &&
                    <LoadingIndicator />
                }
                {warehouseData && (
                    <Stack spacing={2}>
                        <Grid item xs={12}>
                            <TextField type={"text"} value={warehouseData.product_name} fullWidth/>
                        </Grid>
                        <FetchedSelect defaultValue={""} queryName={"categories"} endpoint={"categories"} method={"GET"} />
                            <TextField type={"number"} value={warehouseData.available_condition} fullWidth />
                            <TextField type={"number"} value={warehouseData.maximum_condition} fullWidth />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color={"error"}>Zamknij okno (bez zapisywania)</Button>
                <Button onClick={handleClose} autoFocus variant={"contained"}>
                    Zapisz
                </Button>
            </DialogActions>
        </Dialog>
    );


}