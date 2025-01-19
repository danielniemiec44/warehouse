import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ListItemButton,
    ListItemIcon,
    ListItemText, IconButton, Tooltip, Typography,
} from '@mui/material';
import {useQuery} from "react-query";
import useCustomFetch from "../Utils/CustomFetchForUseQuery";
import CategoryType from "../Types/CategoryType";
import {useTranslation} from "react-i18next";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import EditIcon from '@mui/icons-material/Edit';


interface CategoriesDialogProps {
    onClose: () => void;
    onAddCategory: () => void;
}

const CategoriesDialog: React.FC<CategoriesDialogProps> = ({ onClose, onAddCategory }) => {
    const { data: categories } = useQuery<CategoryType[]>('categories', useCustomFetch('categories'));
    const { t } = useTranslation();

    const renderRow = ({ index, style }: ListChildComponentProps) => {
        const category = categories ? categories[index] : null;
        return (
            <ListItemButton style={style} key={index}>
                <ListItemIcon sx={{ fontSize: 36 }}>
                    🗂️
                </ListItemIcon>
                <ListItemText primary={category?.name} />
                <EditIcon />
            </ListItemButton>
        );
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{t('dialogTitles.categories')}</span>
                <Tooltip title={t('dialogActions.add_category')}>
                    <Button onClick={onAddCategory} color="primary" size={"large"}>+</Button>
                </Tooltip>
            </DialogTitle>
            <DialogContent>
                {categories && (
                    <FixedSizeList
                        height={400}
                        width={360}
                        itemSize={46}
                        itemCount={categories.length}
                    >
                        {renderRow}
                    </FixedSizeList>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    {t('dialogActions.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoriesDialog;