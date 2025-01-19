import React from "react";
import {useDispatch, useSelector} from "react-redux";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useMutation, useQuery, useQueryClient} from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import Stack from "@mui/material/Stack";
import LoadingIndicator from "../Utils/LoadingIndicator";
import {useTranslation} from "react-i18next";
import FetchedSelect from "../Utils/FetchedSelect.tsx";

export default function EditEntryModal() {
    const editEntryId = useSelector((state) => state.warehouse.editEntryId);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        data: warehouseData,
        isLoading: isLoadingDataFetch,
        isSuccess: isLoadingDataSuccess
    } = useQuery(["warehouseData", editEntryId], CustomFetchForUseQuery(`warehouse/${editEntryId}`, "GET", null));
    const [changedWarehouseData, setChangedWarehouseData] = React.useState(null);

    if (isLoadingDataSuccess && !changedWarehouseData) {
        setChangedWarehouseData(warehouseData);
    }

    const handleClose = () => {
        dispatch({type: 'CLOSE_EDIT_DELIVERY_MODAL'});
    }

    const mutation = useMutation(
        (newData) => CustomFetchForUseQuery(`warehouse/${editEntryId}`, "PUT", newData)(),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["warehouseData", editEntryId])
                    .then(() => queryClient.invalidateQueries("warehouse"))
                    .then(handleClose);
            },
        }
    );

    const save = () => {
        mutation.mutate(changedWarehouseData);
    }

    const handleChange = (field) => {
        return (e) => {
            setChangedWarehouseData({...changedWarehouseData, [field]: e.target.value});
        };
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
                {warehouseData && changedWarehouseData && (
                    <Stack spacing={2}>
                        <Grid item xs={12}>
                            <TextField type={"text"} value={changedWarehouseData.product_name} onChange={handleChange("product_name")} fullWidth/>
                        </Grid>
                        <FetchedSelect label={t("warehouse.product_type")} value={changedWarehouseData.product_type_id} queryName={"productTypes"} endpoint={"productTypes"} method={"GET"} onChange={handleChange("product_type_id")} />
                        <FetchedSelect label={t("warehouse.category")} value={changedWarehouseData.product_category_id} queryName={"categories"} endpoint={"categories"} method={"GET"} onChange={handleChange("product_category_id")} />
                            <TextField type={"number"} value={changedWarehouseData.available_condition} onChange={handleChange("available_condition")} fullWidth />
                            <TextField type={"number"} value={changedWarehouseData.maximum_condition} onChange={handleChange("maximum_condition")} fullWidth />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color={"error"}>Zamknij okno (bez zapisywania)</Button>
                <Button onClick={save} variant={"contained"}>
                    Zapisz
                </Button>
            </DialogActions>
        </Dialog>
    );


}