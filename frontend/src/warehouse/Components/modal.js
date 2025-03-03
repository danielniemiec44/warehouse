import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import Stack from "@mui/material/Stack";
import LoadingIndicator from "../Utils/LoadingIndicator";
import { clearEditEntryId } from "../features/EditWarehouseModal";

export default function EditWarehouseModal() {
    const editEntryId = useSelector((state) => state.warehouse.editEntryId);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { data: warehouseData, isLoading } = useQuery(
        ["warehouseData", editEntryId],
        CustomFetchForUseQuery(`warehouse/${editEntryId}`, "GET", null),
        { enabled: editEntryId >= 0 }
    );

    const [changedWarehouseData, setChangedWarehouseData] = useState(null);

    useEffect(() => {
        if (warehouseData && !changedWarehouseData) {
            setChangedWarehouseData(warehouseData);
        }
    }, [warehouseData]);

    const handleClose = () => {
        dispatch(clearEditEntryId());
    };

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
    };

    const handleChange = (field) => (e) => {
        setChangedWarehouseData({ ...changedWarehouseData, [field]: e.target.value });
    };

    return (
        <Dialog
            open={editEntryId >= 0}
            onClose={handleClose}
            aria-labelledby="edit-entry-dialog-title"
            aria-describedby="edit-entry-dialog-description"
        >
            <DialogTitle id="edit-entry-dialog-title">Edytuj wpis</DialogTitle>
            <DialogContent>
                {isLoading && <LoadingIndicator />}
                {changedWarehouseData && (
                    <Stack spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                value={changedWarehouseData.product_name}
                                onChange={handleChange("product_name")}
                                fullWidth
                            />
                        </Grid>
                        <TextField
                            type="number"
                            value={changedWarehouseData.available_condition}
                            onChange={handleChange("available_condition")}
                            fullWidth
                        />
                        <TextField
                            type="number"
                            value={changedWarehouseData.maximum_condition}
                            onChange={handleChange("maximum_condition")}
                            fullWidth
                        />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">
                    Zamknij okno (bez zapisywania)
                </Button>
                <Button onClick={save} variant="contained">
                    Zapisz
                </Button>
            </DialogActions>
        </Dialog>
    );
}
