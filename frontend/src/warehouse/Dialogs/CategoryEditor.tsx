import React, { useState } from 'react';
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
    name: string;
    type: string;
    defaultValue: number;
    maxLen: number;
}

const CategoryEditor: React.FC = () => {


    const fields = ["field1", "field2", "field3"];


    const { t } = useTranslation();
    const dispatch = useDispatch();
    const editCategoryId = useSelector((state: RootReducerTypes) => state.warehouse.editCategoryId);

    const [fieldTypes, setFieldTypes] = useState<CategoryFieldTypes[]>([
        { value: 'string', label: 'String' },
    ]);

    const handleClose = () => {
        dispatch({ type: 'CLOSE_EDIT_CATEGORY_MODAL' });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'name':
                setFieldTypes({ ...fieldTypes, name: value });         
                break;
            default:
                break;
        }
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
                                {fields.map((field) => (
                                    <ListItem style={{ backgroundColor: grey[200], marginBottom: '10px' }} key={field}>
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
                                            <Typography noWrap>{field}</Typography>
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
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={name}
                                    onChange={handleChange}
                                    name={"name"}
                                />
                            </Tooltip>

                            <Tooltip title={t('tooltips.categoryType')} arrow>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.categoryType')}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                    name={"name"}
                                />
                            </Tooltip>

                            <Tooltip title={t('tooltips.maxLen')} arrow>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.maxLen')}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                />
                            </Tooltip>

                            <Tooltip title={t('tooltips.defaultValue')} arrow>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label={t('tooltips.defaultValue')}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
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
                    disabled={!name}
                >
                    {t('dialogActions.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryEditor;
