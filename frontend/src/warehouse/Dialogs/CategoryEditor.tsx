import React, {HTMLInputTypeAttribute, useCallback, useEffect, useMemo, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {green, grey} from '@mui/material/colors';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import AddNewItemButton from '../Modules/AddNewItemButton';
import Stack from '@mui/material/Stack';
import {Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import {useMutation, useQueryClient} from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import eventEmitter from "../Utils/eventEmitter";
import {CategoryFieldTypes} from "../Types/CategoryFieldTypes";
import {RootReducerTypes} from "../Reducers";
import {useCategories} from "./CategoriesDialog";

const defaultExampleFields = [
    {
        id: -1,
        name: "Zawartość tlenku wapnia (%)",
        type: "number",
        defaultValue: "60",
        maxLen: 0,
    },
    {
        id: -1,
        name: "Zawartość tlenku krzemu (%)",
        type: "number",
        defaultValue: "25",
        maxLen: 0,
    },
    {
        id: -1,
        name: "Zawartość tlenku glinu (%)",
        type: "number",
        defaultValue: "3",
        maxLen: 0,
    },
    {
        id: -1,
        name: "Zawartość tlenku żelaza (%)",
        type: "number",
        defaultValue: "2",
        maxLen: 0,
    },
    {
        id: -1,
        name: "Gęstość (kg/m^3)",
        type: "number",
        defaultValue: "3100",
        maxLen: 0,
    },
    {
        id: -1,
        name: "Czas wiązania (w minutach)",
        type: "number",
        defaultValue: "300",
        maxLen: 0,
    }
]

interface CategoryEditorProps {
    fieldsFromBackend?: CategoryFieldTypes[];
}

const CategoryEditor: React.FC<CategoryEditorProps> = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const [fieldEditIndex, setFieldEditIndex] = useState<number>(0);
    const editCategoryId = useSelector((state: RootReducerTypes) => state.warehouse.editCategoryId);
    const { data: categories } = useCategories();
    const expectedCategory = useMemo(() => {
        return categories?.find((category) => category.id === editCategoryId);
    }, [categories, editCategoryId]);

    const fieldsFromBackend = useMemo(() => {
        return expectedCategory?.customFields;
    }, [expectedCategory]);

    const [categoryName, setcategoryName] = useState<string>(expectedCategory?.name || "");
    const [newCategoryName, setNewCategoryName] = useState<string>(categoryName);
    const [fields, setFields] = useState<CategoryFieldTypes[]>(fieldsFromBackend ?? defaultExampleFields);
    const [violationsPassed, setViolationsPassed] = useState<boolean>(false);

    const fieldTypes = [
        {
            type: "text",
            label: t('options.text')
        },
        {
            type: "number",
            label: t('options.number')
        },
        {
            type: "date",
            label: t('options.date')
        },
        {
            type: "checkbox",
            label: t('options.boolean')
        }
    ];

    const handleClose = () => {
        queryClient.invalidateQueries('categories');
        dispatch({ type: 'CLOSE_EDIT_CATEGORY_MODAL' });
    };

    const addField = () => {
        setFields((prevFields) => {
            return [...prevFields, {
                id: -1,
                name: "",
                type: "",
                defaultValue: "",
                maxLen: 0,
            }];
        });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value);
        setFields((prevFields) => {
            return prevFields.map((field, index) => {
                if (index === fieldEditIndex) {
                    const newData = { ...field, [name]: value };
                    // if the selected type changed, reset the default value to null
                    if (name === "type") {
                        newData.defaultValue = "";
                    }
                    return newData;
                }
                return field;
            });
        }
        );
    }

    const removeFieldIndex = (index: number) => {
        setFields((prevFields) => {
            const afterUpdate = prevFields.filter((field, i) => i !== index);
            if(fieldEditIndex === index){
                if(index - 1 < 0) {
                    setFieldEditIndex(0)
                } else if(index -1 > afterUpdate.length) {
                    setFieldEditIndex(afterUpdate.length - 1);
                } else {
                    setFieldEditIndex(index - 1);
                }
            }
            if(afterUpdate.length === 0){
                return [
                    {
                        id: -1,
                        name: "",
                        type: "",
                        defaultValue: 0,
                        maxLen: 0,
                    }
                ];
            } else {
                return afterUpdate;
            }
        }
        );
    }

    const mutation = useMutation(() => {
        console.log("Sending data to backend", fields);
        return CustomFetchForUseQuery(`category/${categoryName}`, 'PUT', {
            fields: fields.map((field) => {
                return {
                    id: field.id,
                    name: field.name,
                    type: field.type,
                    defaultValue: field.defaultValue,
                    maxLength: field.maxLen <= 0 ? 1000 : field.maxLen
                };
            }),
            newName: newCategoryName
        })();
    }, {
        onSuccess: (data) => {
            console.log("Data successfully sent to backend", data);
            eventEmitter.emit('showSnackbar', { message: t("infoMessages.category_add_success"), transition: 'slide', variant: 'success' });
            handleClose();
            },
        onError: (error: any) => {
            console.error("Error while sending data to backend", error);
            const errorMessage = error;
            eventEmitter.emit('showSnackbar', { message: errorMessage, transition: 'slide', variant: 'error' });
        }
    });

    const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        mutation.mutate();
    };

    const validationCallback = useCallback(() => {
        const checkViolations = () => {
            return fields.some((field) =>
                field.name === "" ||
                !fieldTypes.some(ft => ft.type === field.type) ||
                (field.type === 'text' && field.maxLen <= 0)
            ) || newCategoryName === "";
        };
        setViolationsPassed(checkViolations());
    }, [fields, newCategoryName]);

    useEffect(() => {
        validationCallback();
    }, [fields, newCategoryName]);

    useEffect(() => {
        validationCallback();
    }, []);

    const handleCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewCategoryName(event.target.value);
    }

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>{t('dialogTitles.add_category')}</DialogTitle>
            <DialogContent>
                {/*Main grid */}
                <Container maxWidth="md" sx={{ mt: 2 }}>
                    <Tooltip title={t("tooltips.categoryName")} arrow children={
                        <TextField label={t("tooltips.categoryName")} fullWidth={true} value={newCategoryName} onChange={(e) => { handleCategoryNameChange(e) }}></TextField>
                    } />
                    <Grid container spacing={3} sx={{ p: 2 }}>
                        <Grid item sx={{ display: 'flex', justifyContent: { xs: "center", md: "left" }, alignItems: "center" }} xs={12} md={6}>
                            <List style={{ width: 'fit-content' }}>
                                <AddNewItemButton onClick={() => { addField() }} />
                                {fields.map((field, index) => (
                                    <ListItem style={{ backgroundColor: fieldEditIndex === index ? green[200] : grey[200], marginBottom: '10px' }} key={field.name}>
                                        <Stack spacing={1} direction="row" sx={{ alignItems: 'center'}}>
                                            <Tooltip title={t('fieldsActions.remove')} arrow children={
                                                <IconButton size="small" color="error" aria-label="remove" onClick={() => { removeFieldIndex(index) }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            } />
                                            { fieldEditIndex !== index && (
                                                <Tooltip title={t('fieldsActions.edit')} arrow children={
                                                    <IconButton color="primary" aria-label="edit" onClick={() => { setFieldEditIndex(index) }}>
                                                        <ModeIcon />
                                                    </IconButton>
                                                } />
                                            ) }

                                            <Typography noWrap>{field.name}</Typography>
                                        </Stack>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', flexDirection: "column", justifyContent: "center" }}>
                            <Tooltip title={t('tooltips.fieldName')} arrow children={
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.fieldName')}
                                    type={"text"}
                                    fullWidth
                                    variant="outlined"
                                    value={fields[fieldEditIndex].name}
                                    onChange={handleChange}
                                    name={"name"}
                                />
                            } />

                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="category-type-label" children={t('tooltips.fieldType')} />
                            <Tooltip title={t('tooltips.fieldType')} arrow children={
                                <Select
                                    autoFocus
                                    margin="dense"
                                    type={"text"}
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={fields[fieldEditIndex].type}
                                    name={"type"}
                                    label={t('tooltips.categoryType')}
                                >
                                    {fieldTypes.map((fieldType) => (
                                        <MenuItem key={fieldType.type} value={fieldType.type}>{fieldType.label}</MenuItem>
                                    ))}
                                </Select>
                            } />
                            </FormControl>

                            {fields[fieldEditIndex].type === "text" && (
                                <Tooltip title={t('tooltips.maxLen')} arrow children={
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label={t('tooltips.maxLen')}
                                        type={"number"}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleChange}
                                        value={fields[fieldEditIndex].maxLen}
                                        name={"maxLen"}
                                    />
                                } />
                                )}

                            <Tooltip title={t('tooltips.defaultValue')} arrow children={fields[fieldEditIndex].type === 'checkbox' ? (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={fields[fieldEditIndex].defaultValue === 'true'}
                                                    onChange={(e) => handleChange({
                                                        target: {
                                                            name: 'defaultValue',
                                                            value: e.target.checked ? 'true' : 'false'
                                                        }
                                                    } as React.ChangeEvent<HTMLInputElement>)}
                                                    name="defaultValue"
                                                />
                                            }
                                            label={t('tooltips.defaultValue')}
                                        />
                                    ) : (
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            label={t('tooltips.defaultValue')}
                                            type={fields[fieldEditIndex].type as HTMLInputTypeAttribute}
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
                                            value={fields[fieldEditIndex].defaultValue}
                                            name="defaultValue"
                                        />
                                    )}
                            />

                        </Grid>
                    </Grid>
                </Container>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    {t('dialogActions.cancel')}
                </Button>
                <Button
                    color="primary"
                    disabled={violationsPassed}
                    onClick={(e) => { save(e) }}
                >
                    {t('dialogActions.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryEditor;
