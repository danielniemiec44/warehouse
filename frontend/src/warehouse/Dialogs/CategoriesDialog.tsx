import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {useQuery} from "react-query";
import {useTranslation} from "react-i18next";
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import EditIcon from '@mui/icons-material/Edit';
import SquareButton from "../Utils/SquareButton.js";
import {useDispatch, useSelector} from "react-redux";
import type {RootReducerTypes} from "../Reducers";
import LoadingIndicator from "../Utils/LoadingIndicator";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import {CategoryTypes} from "../Types/CategoryTypes";
import IconButton from "@mui/material/IconButton";


const useCategories = () => {
    return useQuery<CategoryTypes[]>(['categories'], () => CustomFetchForUseQuery('categories', "GET", null)());
};

const CategoriesDialog: React.FC = () => {

    const dispatch = useDispatch();
    const { data: categories, isLoading, isError } = useCategories();
    const { t } = useTranslation();
    const showCategoryList = useSelector((state: RootReducerTypes) => state.warehouse.showCategoryList);
    const displayCategoryRows = useSelector((state: RootReducerTypes) => state.warehouse.displayCategoryRows);

    const renderRow = ({ index, style }: ListChildComponentProps) => {
        const category = categories ? categories[index] : null;
        return (
            <ListItemButton style={{...style, color: "primary", backgroundColor: category?.id === displayCategoryRows && "#618833"}} key={index}  onClick={() => { dispatch({ type: "SELECT_DISPLAY_CATEGORY_ROWS", payload: category?.id }) }}>
                <ListItemIcon sx={{ fontSize: 36 }}>
                    🗂️
                </ListItemIcon>
                <ListItemText primary={category?.name} />
                <IconButton onClick={(event) => {
                    event.stopPropagation();
                    openCategoryEditor(category.id)
            }}>
                    <EditIcon />
                </IconButton>
            </ListItemButton>
        );
    };

    const openCategoryEditor = (id = 0) => {
        console.log("Open category editor, id: ", id);
        dispatch({ type: 'OPEN_EDIT_CATEGORY_MODAL', payload: id });
    }

    const close = () => {
        dispatch({ type: 'CLOSE_CATEGORY_LIST_MODAL' });
    }

    return (
        <Dialog open={showCategoryList} onClose={close} fullWidth maxWidth="xs">
            <DialogTitle style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{t('dialogTitles.categories')}</span>
                <Tooltip title={t('dialogActions.add_category')}>
                    <SquareButton onClick={() => openCategoryEditor(5)} color="primary" size={"40px"} variant={"outlined"}>+</SquareButton>
                </Tooltip>
            </DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <LoadingIndicator />
                ) : isError ? (
                    <Typography color="error">{t('errorMessages.offline')}</Typography>
                ) : (
                    categories?.length > 0 ? (
                        <FixedSizeList
                            height={400}
                            width={400}
                            itemSize={46}
                            itemCount={categories.length}
                        >
                            {renderRow}
                        </FixedSizeList>
                    ) : (
                        <Typography>{t('infoMessages.no_categories')}</Typography>
                    )
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="secondary">
                    {t('dialogActions.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoriesDialog;
export { useCategories };