import React, {CSSProperties, useEffect, useMemo} from 'react';
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
import FloatingSearchButton from "../Components/FloatingSearchButton";


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
        const baseHeaders = baseProperties;
        const customFields = categories?.find(category => category?.id === displayCategoryRows)?.customFields || [];
        return [...baseHeaders, ...customFields];
    }, [displayCategoryRows, categories]);
    const body = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const style2: CSSProperties = { width: `${100 / (headers?.length + 1)}vw`, textAlign: "center" };
    const [maxRows, setMaxRows] = React.useState(2);
    const [page, setPage] = React.useState(1);

    const { data: warehouse } = useQuery<any>(
        ["warehouse", displayCategoryRows, maxRows, page],
        () => CustomFetchForUseQuery(`warehouse/${displayCategoryRows}`, "POST", {
            "maxRows": maxRows,
            "page": page
        })(),
        {
            enabled: displayCategoryRows > 0 && maxRows > 0,
            refetchInterval: 1500
        }
    );

    // changing page basing on direction (1 or -1)
    const changePage = (direction) => {
        if (page + direction > Math.ceil(warehouse?.totalRows / maxRows) || page + direction < 1)
            return;
        setPage(page + direction);
    }


    // set page automatically to first if out fo range
    useEffect(() => {
        if (page > Math.ceil(warehouse?.totalRows / maxRows) || page < 1)
            setPage(1);
    }, [page, warehouse, maxRows]);


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

    const renderRow = ({index, style}: ListChildComponentProps) => {
        const row = warehouse?.warehouses ? warehouse?.warehouses[index] : null;
        //even and odd colors
        let style3 = {...style2};
        if (index % 2 === 0) {
            style3 = {...style3, backgroundColor: "#f2f2f2"};
        }

        return (
            <TableRow style={{ ...style, display: 'flex', alignItems: 'center' }} key={index}>
                {headers?.map((headerMap, index) => {
                    const header = headerMap?.name;
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
                        <Button onClick={() => {changePage(-1)}}><ArrowBackIosNewIcon /></Button>
                            <Select
                                value={maxRows}
                                onChange={handleChangeMaxRows}
                                renderValue={(selected) => {
                                    //return "1-10";
                                    return `${(page - 1) * maxRows + 1}-${page * maxRows}`;
                                }}
                            >
                                {[1, 2, 5, 10, 15, 20, 30, 40, 50, 100, 200, 500, 1000].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography>z {warehouse?.totalRows} (Strona: {page} z {Math.ceil(warehouse?.totalRows / maxRows)})</Typography>
                        <Button onClick={() => {changePage(1)}}><ArrowForwardIosIcon /></Button>
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
                        {headers.map((headerMap, index) => {
                            const header = headerMap?.name;

                            return (
                            <TableCell key={index} style={style2}>
                                <Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
                                    <Typography>{header}</Typography>
                                    <FloatingSearchButton type={headerMap?.type} />
                            </Stack>
                            </TableCell>
                        )})}
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
                    itemCount={warehouse?.warehouses?.length ?? 0}
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