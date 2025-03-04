import React, {CSSProperties, useMemo} from 'react';
import AppBar from "../AppBar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useDispatch, useSelector} from "react-redux";
import EditEntryModal from "../Dialogs/EditEntryModal.js";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import {useQuery} from "react-query";
import CategoriesDialog, {useCategories} from "../Dialogs/CategoriesDialog";
import {RootReducerTypes} from "../Reducers";
import CategoryEditor from "../Dialogs/CategoryEditor";
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import {useTranslation} from "react-i18next";
import {Autocomplete, Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {baseProperties} from "../constants";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Grid from "@mui/material/Grid";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TextField from "@mui/material/TextField";


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
        const baseHeaders = baseProperties.map(property => property.name);
        const customFields = categories?.find(category => category?.id === displayCategoryRows)?.customFields?.map(field => field.name) || [];
        return [...baseHeaders, ...customFields];
    }, [displayCategoryRows, categories]);
    const body = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const style2: CSSProperties = { width: `${100 / (headers?.length + 1)}vw`, textAlign: "center" };
    const [maxRows, setMaxRows] = React.useState(10);

    const handleChangeMaxRows = (event) => {
        const numericValue = Number(event.target.value);
        if (!isNaN(numericValue) && numericValue > 0) {
            setMaxRows(event.target.value);
        }
    };


    const handleEditEntry = (id) => {
        dispatch({type: 'OPEN_EDIT_ENTRY_MODAL', payload: id});
    }

    const handleOpenCategoryList = () => {
        dispatch({type: 'OPEN_CATEGORY_LIST_MODAL'});
    }

    const { data: warehouse } = useQuery<any>(
        ["warehouse", displayCategoryRows],
        () => CustomFetchForUseQuery(`warehouse/${displayCategoryRows}`, "GET", null)(),
        {
            enabled: displayCategoryRows > 0,
            refetchInterval: 1500
        }
    );

    const renderRow = ({index, style}: ListChildComponentProps) => {
        const row = warehouse ? warehouse[index] : null;
        //even and odd colors
        let style3 = {...style2};
        if (index % 2 === 0) {
            style3 = {...style3, backgroundColor: "#f2f2f2"};
        }

        return (
            <TableRow style={{ ...style, display: 'flex', alignItems: 'center' }} key={index}>
                {headers?.map((header, index) => {
                    if(baseProperties.map(property => property.name).includes(header)) {
                        return (
                            <TableCell key={index} style={style3}>{row[header]}</TableCell>
                        )
                    }
                    return (
                        <TableCell key={index} style={style3}>{row?.properties?.find((property) => property?.customField?.name === header)?.PropertyValue}</TableCell>
                        )

                })}
                <TableCell>
                    <Button disabled variant={"contained"} size={"small"} color={"primary"} onClick={() => handleEditEntry(row.id)}>Edytuj (dostępne wkrótce)</Button>
                </TableCell>
            </TableRow>
        );
    };


    return (
        <div>
        <AppBar/>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20 }}>
                <Grid container spacing={3}>
                    <Grid item>
                        <Typography variant={'h5'}> Zarządzanie stanami magazynowymi </Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        <Button><ArrowBackIosNewIcon /></Button>
                            <Select
                                value={maxRows}
                                onChange={handleChangeMaxRows}
                                renderValue={(selected) => {
                                    if (selected === 10) {
                                        return "1-10";
                                    }
                                    return selected;
                                }}
                            >
                                {[5, 10, 20, 50, 100].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        <Button><ArrowForwardIosIcon /></Button>
                        </Stack>
                    </Grid>
                </Grid>
            <Stack direction={"row"} spacing={5}>
                {/*<Button variant={"contained"} color={"primary"} style={{marginRight: "10px"}} onClick={handleOpenAddDeliveryModal}>Dodaj dostawę</Button>*/}
                    <Button variant={"contained"} color={"primary"} onClick={() => { handleOpenCategoryList() }}>Kategorie</Button>
            </Stack>
            </div>
            {displayCategoryRows < 0 ? t("infoMessages.select_category_first") : (
                <Box>
                <TableHead>
                    <TableRow style={style2}>
                        {headers.map((header, index) => (
                            <TableCell key={index} style={style2}>
                                <Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
                                    <Typography>{header}</Typography>
                                    <Button>
                                        <FilterAltIcon />
                                    </Button>
                            </Stack>
                            </TableCell>
                        ))}
                        <TableCell>
                            <Tooltip title={"Dodaj produkt"} arrow>
                                <Button onClick={() => { dispatch({ type: "OPEN_EDIT_ENTRY_MODAL", payload: 0 }) }} variant={"contained"} size={"small"}><AddBoxIcon />{t("actions.addProduct")}</Button>
                            </Tooltip>
                </TableCell>
                    </TableRow>
                </TableHead>
                <FixedSizeList
                    height={500}
                    itemSize={50}
                    alignItems={"center"}
                    itemCount={warehouse?.length ?? 0}
                >
                    {renderRow}
                </FixedSizeList>
                </Box>
            )}

            { editEntryId >= 0 && <EditEntryModal /> }
            {showCategoryList === true && <CategoriesDialog /> }
            {editCategoryId >= 0 && categories && (
                <CategoryEditor />
            )}

        </div>
    );
}