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
import {Box, Checkbox, MenuItem, Select, TableBody} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {baseProperties} from "../constants";
import Grid from "@mui/material/Grid";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FloatingSearchButton from "../Components/FloatingSearchButton";
import ProductDetails from "../Dialogs/ProductDetails";
import ExtendableMenuButton from "../Components/ExtendableMenuButton";
import AutoSizer from 'react-virtualized-auto-sizer';
import SellModal from "../Dialogs/SellModal";
import {CategoryTypes} from "../Types/CategoryTypes";

export const useWarehouse = (displayCategoryRows, maxRows, page, filter) => {
    return useQuery<any>(
        ["warehouse", displayCategoryRows, maxRows, page, filter],
        () => CustomFetchForUseQuery(`warehouse/${displayCategoryRows !== undefined ? displayCategoryRows : ''}`, "POST", {
        "maxRows": maxRows,
            "page": page,
            search: filter
        })(),
        {
            refetchInterval: 1500
        }
    );
};


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
    const [maxRows, setMaxRows] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [filter, setFilter] = React.useState([]);
    const productDetailsId = useSelector((state: RootReducerTypes) => state.warehouse.productDetailsId);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const saleItems = useSelector((state: RootReducerTypes) => state.warehouse.saleItems);

    const headerHeight = 50;
    const columnWidth = 300; // Fixed width for all columns
    const getTableWidth = useMemo(() => {
        // Total columns = headers + checkbox + actions
        const totalColumns = (headers?.length ?? 0) + 2;
        return columnWidth * totalColumns;
    }, [headers?.length]);

    const selectRow = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setSelectedRows(prev => {
            if (e.target.checked) {
                return [...prev, id];
            }
            return prev.filter(rowId => rowId !== id);
        });
    };

    const { data: warehouse } = useWarehouse(displayCategoryRows, maxRows, page, filter);

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

    const changeFilter = (e, name) => {
        console.log(`${name}: `, e?.target?.value, e?.target?.checked);
        let newValue = e?.target?.value;
        if(headers.find((headerFind) => headerFind?.name === name)?.type === "checkbox") {
            newValue = e?.target?.checked;
        }
        setFilter({...filter, [name]: newValue});
    }

    useEffect(() => {
        console.log("Filter changed to: ", filter);
    }, [filter]);

    const renderRow = ({index, style}: ListChildComponentProps) => {
        const row = warehouse?.warehouses ? warehouse?.warehouses[index] : null;

        if(row) {
            /*
            //even and odd colors
            let style3 = {...style2};
            if (index % 2 === 0) {
                style3 = {backgroundColor: "#f2f2f2"};
            }

             */

            return (
                <TableRow style={{ ...style, display: 'flex', textAlign: 'center' }} key={index}>
                    <TableCell key={index} style={{ width: columnWidth, minWidth: columnWidth, textAlign: 'center' }}>
                        <Checkbox
                            checked={selectedRows?.includes(row?.id)}
                            onChange={(e) => selectRow(e, row?.id)}
                        />
                    </TableCell>
                    {headers?.map((headerMap, index) => {
                        const header = headerMap?.name;
                        if (baseProperties?.map(property => property?.name).includes(header)) {
                            return (
                                <TableCell key={index} style={{ width: columnWidth, minWidth: columnWidth, textAlign: 'center' }}>{row[header]}</TableCell>
                            )
                        }
                        return (
                            <TableCell key={index} style={{ width: columnWidth, minWidth: columnWidth, textAlign: 'center' }}>{row?.properties?.find((property) => property?.customField?.name === header)?.PropertyValue}</TableCell>
                        )

                    })}
                    <TableCell>
                        {/*
                    <Button disabled variant={"contained"} size={"small"} color={"primary"} onClick={() => handleEditEntry(row.id)}>Edytuj (dostępne wkrótce)</Button>
                    */}
                        <Button onClick={() => {
                            dispatch({type: "OPEN_PRODUCT_DETAILS_MODAL", payload: row?.id})
                        }}>Szczegóły</Button>
                    </TableCell>
                </TableRow>
            );
        }
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
            <Grid container spacing={5}>
                {/*<Button variant={"contained"} color={"primary"} style={{marginRight: "10px"}} onClick={handleOpenAddDeliveryModal}>Dodaj dostawę</Button>*/}
                <Grid item lg={6} xs={12}></Grid>
                <Grid item lg={3} xs={12}>
                <ExtendableMenuButton
                    title={"Zaznaczenie"}
                    disabled={selectedRows.length === 0}
                    items={[{
                    label: "Sprzedaj z magazynu",
                    onClick: () => { console.log("Opening sell modal..."); dispatch({ type: "OPEN_COMPLETING_SALE_MODAL", payload: selectedRows }) }
                }]} />
                </Grid>
                <Grid item lg={3} xs={12}>
                <Button variant={"contained"} color={"primary"} onClick={() => { handleOpenCategoryList() }}>Kategorie</Button>
                </Grid>
            </Grid>
            </div>
            {displayCategoryRows < 0 ? t("infoMessages.select_category_first") : (
                <div style={{ height: 'calc(100vh - 200px)', width: "100vw", overflow: "auto" }}> {/* Adjust 200px based on your header/nav heights */}
                    <TableHead>
                    <TableRow>
                        <TableCell key={"select-header"} style={{ width: columnWidth, minWidth: columnWidth, textAlign: "center" }}>
                            <Typography>Selected: {selectedRows?.length}</Typography>
                            <Button onClick={() => { setSelectedRows([]) }}>Unselect All</Button>
                            <Button onClick={() => { setSelectedRows(warehouse?.warehouses?.map(row => row?.id)) }}>
                                Select All Visible
                            </Button>
                        </TableCell>
                        {headers?.map((headerMap, index) => {
                            const header = headerMap?.name;

                            return (
                            <TableCell key={index} style={{ width: columnWidth, minWidth: columnWidth }}>
                                <Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
                                    <Typography>{header}</Typography>
                                    <FloatingSearchButton type={headerMap?.type} onChange={(e) => { changeFilter(e, headerMap?.name) }} value={filter?.[headerMap?.name]} />
                            </Stack>
                            </TableCell>
                        )})}
                        <TableCell style={{ width: columnWidth, minWidth: columnWidth }}>
                            <Tooltip title={"Dodaj produkt"} arrow>
                                <Button onClick={() => { dispatch({ type: "OPEN_EDIT_ENTRY_MODAL", payload: 0 }) }} variant={"contained"} size={"small"}><AddBoxIcon />{t("actions.addProduct")}</Button>
                            </Tooltip>
                </TableCell>
                    </TableRow>
                </TableHead>
                    <div style={{ height: `calc(100% - ${headerHeight}px)` }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <FixedSizeList
                                height={height}
                                width={getTableWidth}
                                itemCount={warehouse?.warehouses?.length ?? 0}
                                itemSize={50}
                            >
                                {renderRow}
                            </FixedSizeList>
                        )}
                    </AutoSizer>
                    </div>
                </div>
            )}

            { editEntryId >= 0 && <EditEntryModal /> }
            {showCategoryList === true && <CategoriesDialog /> }
            {editCategoryId >= 0 && categories && (
                <CategoryEditor />
            )}
            {productDetailsId >= 0 && (
                <ProductDetails />
            )}

            {saleItems !== null && (
                <SellModal />
            )}



        </div>
    );
}