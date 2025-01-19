import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useTranslation} from "react-i18next";
import FlavorList from "../FlavorList";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export default function NewOrderDialog() {
    const { t } = useTranslation();

    return(
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">
                {t("newOrder.choose_flavors")}
            </DialogTitle>
            <DialogContent sx={{ margin: 0, padding: 0}}>
                <Stack spacing={0} sx={{ p: 1 }}>
                    <TextField size={"small"} label={`${t("actions.search")}...`} />
                    <FlavorList />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button color={"error"}>{t("dialogActions.clear")}</Button>
                <Stack direction={"row"} spacing={5}>
                <Button color={"error"}>{t("dialogActions.cancel")}</Button>
                <Button variant={"contained"}>{t("dialogActions.confirm")}</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );


}