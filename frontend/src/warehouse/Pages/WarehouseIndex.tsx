import React from 'react';
import AppBar from "../AppBar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useDispatch, useSelector} from "react-redux";
import NewDeliveryDialog from "../Dialogs/NewDeliveryDialog";
import EditEntryModal from "../Dialogs/EditEntryModal";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import {useQuery} from "react-query";
import { styled } from '@mui/material/styles';
import CategoriesDialog from "../Dialogs/CategoriesDialog";
import {RootReducerTypes} from "../Reducers";
import CategoryEditor from "../Dialogs/CategoryEditor";


export default function WarehouseIndex() {
    const dispatch = useDispatch();
    const editEntryId = useSelector((state: RootReducerTypes) => state.warehouse.editEntryId)
    const showCategoryList = useSelector((state: RootReducerTypes) => state.warehouse.showCategoryList);
    const editCategoryId = useSelector((state: RootReducerTypes) => state.warehouse.editCategoryId);


    const EvenRow = styled(TableRow)(() => ({
        backgroundColor: '#f5f5f5',
    }));

    const OddRow = styled(TableRow)(() => ({
        backgroundColor: '#ffffff',
    }));

    const LowConditionRow = styled(TableRow)(() => ({
        backgroundColor: '#ffcccc',
    }));

    const handleOpenAddDeliveryModal = () => {
        dispatch({ type: 'OPEN_ADD_DELIVERY_MODAL' });
    };

    const handleEditEntry = (id) => {
        dispatch({ type: 'OPEN_EDIT_ENTRY_MODAL', payload: id });
    }

    const handleOpenCategoryList = () => {
        dispatch({ type: 'OPEN_CATEGORY_LIST_MODAL' });
    }

    const { data: warehouse } = useQuery<any>("warehouse", CustomFetchForUseQuery("warehouse", "GET", null));

    return (
        <div style={{width: '100%'}}>
        <AppBar/>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20 }}>
                <Typography variant={'h5'}> Zarządzanie stanami magazynowymi </Typography>
            <Stack direction={"row"}>
                    <Button variant={"contained"} color={"primary"} style={{marginRight: "10px"}} onClick={handleOpenAddDeliveryModal}>Dodaj dostawę</Button>
                    <Button variant={"contained"} color={"primary"} onClick={() => { handleOpenCategoryList() }}>Kategorie</Button>
            </Stack>
            </div>
                    <TableContainer style={{ padding: 20 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID produktu</TableCell>
                                    <TableCell align="right">Nazwa produktu</TableCell>
                                    <TableCell align="right">Rodzaj produktu</TableCell>
                                    <TableCell align="right">Kategoria</TableCell>
                                    <TableCell align="right">Dostępny stan</TableCell>
                                    <TableCell align="right">Ilość maksymalna</TableCell>
                                    <TableCell align="right">Akcje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {warehouse && warehouse.map((row, index) => {
                                    const RowComponent = row?.available_condition < 10 ? LowConditionRow : (index % 2 === 0 ? EvenRow : OddRow);
                                    return (
                                        <RowComponent key={row?.id}>
                                            <TableCell component="th" scope="row">
                                                {row?.id}
                                            </TableCell>
                                            <TableCell align="right">{row?.product_name}</TableCell>
                                            <TableCell align="right">{row?.productType?.name}</TableCell>
                                            <TableCell align="right">{row?.category?.name}</TableCell>
                                            <TableCell align="right">{row?.available_condition}</TableCell>
                                            <TableCell align="right">{row?.maximum_condition}</TableCell>
                                            <TableCell align="right">
                                                <Button variant={"text"} color={"primary"} style={{ marginRight: "10px" }} onClick={() => handleEditEntry(row?.id)}>Edytuj</Button>
                                                <Button variant={"outlined"} color={"error"}>Usuń produkt</Button>
                                            </TableCell>
                                        </RowComponent>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                <NewDeliveryDialog />
            { editEntryId >= 0 && <EditEntryModal /> }
            {showCategoryList === true && <CategoriesDialog /> }
            { editCategoryId >= 0 && <CategoryEditor /> }
        </div>
    );
}