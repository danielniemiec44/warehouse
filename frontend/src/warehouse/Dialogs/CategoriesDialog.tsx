import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemButton, ListItemIcon
} from '@mui/material';
import {useQuery} from "react-query";
import useCustomFetch from "../Utils/CustomFetchForUseQuery";
import CategoryType from "../Types/CategoryType";
import EditIcon from '@mui/icons-material/Edit';
import {useTranslation} from "react-i18next";

interface CategoriesDialogProps {
    onClose: () => void;
    onAddCategory: () => void;
}

const CategoriesDialog: React.FC<CategoriesDialogProps> = ({ onClose, onAddCategory }) => {
    const { data: categories } = useQuery<CategoryType[]>('categories', useCustomFetch('categories'));
    const { t } = useTranslation();

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>{t('dialogTitles.categories')}</DialogTitle>
            <DialogContent>
                <List sx={{ width: '100%', minWidth: 360, bgcolor: 'background.paper' }}>
                    {categories && categories.map((category, index) => (
                        <ListItemButton>
                            <ListItemIcon sx={{ fontSize: 36 }}>
                                🗂️
                            </ListItemIcon>
                            <ListItemText primary={category.name} />
                            <EditIcon />
                        </ListItemButton>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onAddCategory} color="primary">
                    {t('dialogActions.add_category')}
                </Button>
                <Button onClick={onClose} color="secondary">
                    {t('dialogActions.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoriesDialog;