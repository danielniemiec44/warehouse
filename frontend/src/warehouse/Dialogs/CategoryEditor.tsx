import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootReducerTypes } from '../Reducers';

const CategoryEditor: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const editCategoryId = useSelector((state: RootReducerTypes) => state.warehouse.editCategoryId);

    const [name, setName] = useState<string>('');

    const handleClose = () => {
        dispatch({ type: 'CLOSE_EDIT_CATEGORY_MODAL' });
    };

    return (
        <Dialog open={editCategoryId === 0} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('dialogTitles.add_category')}</DialogTitle>
            <DialogContent>
                <Tooltip title={t('tooltips.categoryName')} arrow>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('fields.category_name')}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Tooltip>
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
