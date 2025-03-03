import React, {CSSProperties, useMemo} from 'react';
import AppBar from "../AppBar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useDispatch, useSelector} from "react-redux";
import NewDeliveryDialog from "../Dialogs/NewDeliveryDialog";
import EditEntryModal from "../Dialogs/EditEntryModal";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import {useQuery} from "react-query";
import CategoriesDialog, {useCategories} from "../Dialogs/CategoriesDialog";
import {RootReducerTypes} from "../Reducers";
import CategoryEditor from "../Dialogs/CategoryEditor";
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import {useTranslation} from "react-i18next";
import {Box} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddBoxIcon from '@mui/icons-material/AddBox';


export default function WarehouseIndex() {
    const dispatch = useDispatch();
    const editEntryId = useSelector((state: RootReducerTypes) => state.warehouse.editEntryId)
    const showCategoryList = useSelector((state: RootReducerTypes) => state.warehouse.showCategoryList);
    const editCategoryId = useSelector((state: RootReducerTypes) => state.warehouse.editCategoryId);
    const {data: categories} = useCategories();
    const displayCategoryRows = useSelector((state: RootReducerTypes) => state.warehouse.displayCategoryRows);
    const { t } = useTranslation();
    // Update the useMemo hook to correctly access the customFields array
    const headers = useMemo(() => {
        return categories?.find(category =>
            category?.id === displayCategoryRows
        )?.customFields?.map(field => field.name) || [];
    }, [displayCategoryRows, categories]);
    const body = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const style2: CSSProperties = { width: `${100 / (headers?.length + 1)}vw`, textAlign: "center" };

    const handleOpenAddDeliveryModal = () => {
        dispatch({type: 'OPEN_ADD_DELIVERY_MODAL'});
    };

    const handleEditEntry = (id) => {
        dispatch({type: 'OPEN_EDIT_ENTRY_MODAL', payload: id});
    }

    const handleOpenCategoryList = () => {
        dispatch({type: 'OPEN_CATEGORY_LIST_MODAL'});
    }

    const {data: warehouse} = useQuery<any>("warehouse", CustomFetchForUseQuery("warehouse", "GET", null));

    const renderRow = ({index, style}: ListChildComponentProps) => {
        const row = warehouse ? warehouse[index] : null;
        //even and odd colors
        let style3 = {...style2};
        if (index % 2 === 0) {
            style3 = {...style3, backgroundColor: "#f2f2f2"};
        }

        return (
            <TableRow style={{ ...style, display: 'flex', alignItems: 'center' }} key={index}>
                {headers?.map((header, index) => (
                    <TableCell key={index} style={style3}>{body[index]}</TableCell>
                ))}
                <TableCell>
                    <Button variant={"contained"} size={"small"} color={"primary"} onClick={() => handleEditEntry(row.id)}>Edytuj</Button>
                </TableCell>
            </TableRow>
        );
    };


    return (
        <div>
        <AppBar/>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20 }}>
                <Typography variant={'h5'}> Zarządzanie stanami magazynowymi </Typography>
            <Stack direction={"row"}>
                {/*<Button variant={"contained"} color={"primary"} style={{marginRight: "10px"}} onClick={handleOpenAddDeliveryModal}>Dodaj dostawę</Button>*/}
                    <Button variant={"contained"} color={"primary"} onClick={() => { handleOpenCategoryList() }}>Kategorie</Button>
            </Stack>
            </div>
            {displayCategoryRows < 0 ? t("infoMessages.select_category_first") : (
                <Box>
                <TableHead>
                    <TableRow style={style2}>
                        {headers.map((header, index) => (
                            <TableCell key={index} style={style2}>{header}</TableCell>
                        ))}
                        <TableCell>
                            <Tooltip title={"Dodaj produkt"} arrow>
                                <Button variant={"contained"} size={"small"}><AddBoxIcon />{t("actions.addProduct")}</Button>
                            </Tooltip>
                </TableCell>
                    </TableRow>
                </TableHead>
                <FixedSizeList
                    height={500}
                    itemSize={50}
                    alignItems={"center"}
                    itemCount={categories?.length ?? 10}
                >
                    {renderRow}
                </FixedSizeList>
                </Box>
            )}

                <NewDeliveryDialog />
            { editEntryId >= 0 && <EditEntryModal /> }
            {showCategoryList === true && <CategoriesDialog /> }
            {editCategoryId >= 0 && categories && (
                <CategoryEditor />
            )}

        </div>
    );
}