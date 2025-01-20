import React, {HTMLInputTypeAttribute, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootReducerTypes } from '../Reducers';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { grey } from '@mui/material/colors';
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

interface CategoryFieldTypes {
    id: number;
    name: string;
    type: string;
    defaultValue: number;
    maxLen: number;
}

const CategoryEditor: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const editCategoryId = useSelector((state: RootReducerTypes) => state.warehouse.editCategoryId);
    const [fieldEditIndex, setFieldEditIndex] = useState<number>(0);
    const [fieldsFromBackend, setFieldsFromBackend] = useState<CategoryFieldTypes[]>(
        [
            {
                id: 1,
                name: "Example",
                type: "Example type",
                defaultValue: 0,
                maxLen: 0,
            }
        ]
    );

    const enabledInputFields: Partial<Record<keyof CategoryFieldTypes, HTMLInputTypeAttribute>> =
        {
            name: "text",
            type: "text",
            defaultValue: "number",
            maxLen: "number",
        };

    const handleClose = () => {
        dispatch({ type: 'CLOSE_EDIT_CATEGORY_MODAL' });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value);
        setFieldsFromBackend((prevFields) => {
            return prevFields.map((field, index) => {
                if (index === fieldEditIndex) {
                    return { ...field, [name]: value };
                }
                return field;
            });
        }
        );
    }

    return (
        <Dialog open={editCategoryId === 0} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('dialogTitles.add_category')}</DialogTitle>
            <DialogContent>
                {/*Main grid */}
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <List>
                                <AddNewItemButton />
                                {fieldsFromBackend.map(field => (
                                    <ListItem style={{ backgroundColor: grey[200], marginBottom: '10px' }} key={field.id}>
                                        <Stack spacing={1} direction="row" sx={{ alignItems: 'center'}}>
                                            <Tooltip title={t('fieldsActions.remove')} arrow>
                                                <IconButton size="small" color="error" aria-label="remove">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('fieldsActions.edit')} arrow>
                                                <IconButton color="primary" aria-label="edit">
                                                    <ModeIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Typography noWrap>{field.name}</Typography>
                                        </Stack>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <Tooltip title={t('tooltips.categoryName')} arrow>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.categoryName')}
                                    type={enabledInputFields.name}
                                    fullWidth
                                    variant="outlined"
                                    value={fieldsFromBackend[fieldEditIndex].name}
                                    onChange={handleChange}
                                    name={"name"}
                                />
                            </Tooltip>

                            <Tooltip title={t('tooltips.categoryType')} arrow>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.categoryType')}
                                    type={enabledInputFields.type}
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={fieldsFromBackend[fieldEditIndex].type}
                                    name={"type"}
                                />
                            </Tooltip>

                            <Tooltip title={t('tooltips.maxLen')} arrow>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.maxLen')}
                                    type={enabledInputFields.maxLen}
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={fieldsFromBackend[fieldEditIndex].maxLen}
                                    name={"maxLen"}
                                />
                            </Tooltip>

                            <Tooltip title={t('tooltips.defaultValue')} arrow>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.defaultValue')}
                                    type={enabledInputFields.defaultValue}
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={fieldsFromBackend[fieldEditIndex].defaultValue}
                                    name={"defaultValue"}
                                />
                            </Tooltip>
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
                    disabled={!fieldsFromBackend.every(field => field.name)}
                >
                    {t('dialogActions.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryEditor;
