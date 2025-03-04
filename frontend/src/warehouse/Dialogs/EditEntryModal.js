import React, {useCallback, useEffect, useMemo, useState} from "react";
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
import {useCategories} from "./CategoriesDialog";
import Typography from "@mui/material/Typography";
import {CheckBox} from "@mui/icons-material";
import {Checkbox, FormControlLabel} from "@mui/material";
import eventEmitter from "../Utils/eventEmitter";
import {baseProperties} from "../constants";

export default function EditEntryModal() {
    const editEntryId = useSelector((state) => state.warehouse.editEntryId);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const displayCategoryRows = useSelector((state) => state.warehouse.displayCategoryRows);
    const { data: categories, isLoading, isError } = useCategories();

    const generateExampleFieldsFromBackendForSelectedCategory = useMemo(() => {
        if (categories) {
            const selectedCategory = categories.find((category) => category.id === displayCategoryRows);
            const fieldsFromBackend = {};
            selectedCategory?.customFields.forEach((field) => {
                if (field.type === "text") {
                    fieldsFromBackend[field.name] = t("fields.example_text");
                } else if (field.type === "number") {
                    fieldsFromBackend[field.name] = Math.floor(Math.random() * 100);
                } else if (field.type === "checkbox") {
                    fieldsFromBackend[field.name] = false;
                }
            });
            return fieldsFromBackend;
        }
        return {};
    }, [displayCategoryRows, categories]);

    const [fields, setFields] = useState({
        baseProperties: {name: "Przykład", quantity: 0, barcode: null},
        customFields: {}
    });

    useEffect(() => {
        console.log("fields changed to: ", fields);
    }, [fields]);

    useEffect(() => {
        setFields((prevFields) => ({
            baseProperties: { ...prevFields.baseProperties },
            customFields: generateExampleFieldsFromBackendForSelectedCategory
        }));
    }, [generateExampleFieldsFromBackendForSelectedCategory]);

    const handleClose = () => {
        dispatch({ type: "CLOSE_EDIT_ENTRY_MODAL" });
    }

    const changeFieldValue = (event) => {
        let fieldName = event.target.name;
        setFields((prevFields) => ({
            ...prevFields,
            baseProperties: {
                ...prevFields.baseProperties,
                [fieldName]: event.target.value
            }
        }));
    }

    const changeCustomFieldValue = (event) => {
        let fieldName = event.target.name;
        setFields((prevFields) => ({
            ...prevFields,
            customFields: {
                ...prevFields.customFields,
                [fieldName]: event.target.value
            }
        }));
    }

    const showCorrectFieldType = (field, isCustomField) => {
        if (field.type === "checkbox") {
            return (
                <FormControlLabel
                    key={field.id}
                    control={<Checkbox />}
                    label={field.name}
                    name={field.name}
                    onChange={(event) => {
                        const fieldName = event.target.name;
                        setFields((prevFields) => ({
                            ...prevFields,
                            customFields: {
                                ...prevFields.customFields,
                                [fieldName]: event.target.checked
                            }
                        }));
                    }}
                    checked={isCustomField ? Boolean(fields.customFields[field.name]) : Boolean(fields.baseProperties[field.name])}
                />
            );
        }

        if(field.type === "number") {
            return (
                <TextField
                    key={field.id}
                    fullWidth
                    label={field.label ?? field.name}
                    variant={"outlined"}
                    type={"number"}
                    value={isCustomField ? fields.customFields[field.name] : fields.baseProperties[field.name]}
                    onChange={isCustomField ? changeCustomFieldValue : changeFieldValue}
                    name={field.name}
                />
            );
        }

        return (
            <TextField
                key={field.id}
                fullWidth
                label={field.label ?? field.name}
                variant={"outlined"}
                type={field.type === "number" ? "number" : "text"}
                value={isCustomField ? fields.customFields[field.name] : fields.baseProperties[field.name]}
                onChange={isCustomField ? changeCustomFieldValue : changeFieldValue}
                name={field.name}
            />
        );
    }



    const mutation = useMutation(() => {
        const modifiedFields = {
            baseProperties: Object.fromEntries(
                Object.entries(fields.baseProperties).map(([key, value]) => {
                    if (key === 'quantity') {
                        return [key, Number(value) || 0];
                    }
                    return [key, value];
                })
            ),
            //convert EVERY customFields values to string
            customFields: Object.fromEntries(
                Object.entries(fields.customFields).map(([key, value]) => {
                    return [key, value.toString()];
                })
            )

        };

        console.log("Sending modified fields:", modifiedFields);
        return CustomFetchForUseQuery(
            `/warehouse/${displayCategoryRows}/${editEntryId}`,
            "PUT",
            modifiedFields
        )();
    }, {
        onSuccess: () => {
            eventEmitter.emit('showSnackbar', { message: t("snackbarMessages.entry_saved"), transition: 'slide', variant: 'success' });
            queryClient.invalidateQueries("warehouse");
            handleClose();
        },
        onError: (error) => {
            eventEmitter.emit('showSnackbar', { message: error, transition: 'slide', variant: 'error' });
            console.error("Mutation error:", error);
        }
    });


    const saveChanges = () => {
        mutation.mutate();
    }

    return(
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"sm"}
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                {editEntryId === 0 && t("dialogTitles.add_new_entry")}
                {editEntryId > 0 && t("dialogTitles.edit_entry")}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ p: 2 }}>
                    <Typography>{t("warehouse.base_properties")}:</Typography>
                    {baseProperties.map((key) =>
                        showCorrectFieldType(key, false)
                    )}
                    <hr />
                    <Typography>{t("warehouse.category_properties")}:</Typography>
                    {categories?.find((category) => category?.id === displayCategoryRows)?.customFields?.map((field) =>
                        showCorrectFieldType(field, true)
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color={"error"}>Zamknij okno (bez zapisywania)</Button>
                <Button onClick={saveChanges} variant={"contained"}>Zapisz</Button>
            </DialogActions>
        </Dialog>
    );
}