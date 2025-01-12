import React, {useCallback} from 'react';
import AppBar from "../AppBar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useDispatch, useSelector} from "react-redux";
import NewDeliveryDialog from "../Dialogs/NewDeliveryDialog";
import {CustomFetch} from "../Utils/CustomFetch";
import EditEntryModal from "../Dialogs/EditEntryModal";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import {useQuery} from "react-query";



export default function WarehouseIndex() {
    const dispatch = useDispatch();
    const editEntryId = useSelector((state) => state.delivery.editEntryId)

    const handleOpenAddDeliveryModal = () => {
        dispatch({ type: 'OPEN_ADD_DELIVERY_MODAL' });
    };

    const handleEditEntry = (id) => {
        dispatch({ type: 'OPEN_EDIT_ENTRY_MODAL', payload: id });
    }

    const { data: warehouse, isLoading: isLoadingDataFetch, isError: isErrorDataFetch } = useQuery("warehouse", CustomFetchForUseQuery("warehouse", "GET", null));

    return (
        <div style={{width: '100%'}}>
        <AppBar/>
          <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginTop: "20px"}}>
                <Typography variant={'h5'}> Zarządzanie stanami magazynowymi </Typography>
                <div>
                    <Button variant={"contained"} color={"primary"} style={{marginRight: "10px"}} onClick={() => {handleOpenAddDeliveryModal()}}>Dodaj dostawę</Button>
                </div>
          </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', justifyItems: 'center', flexWrap: 'wrap', marginTop: '25px'}}>
                <Paper elevation={3} style={{width: '90%', maxWidth: '90%', minWidth: '50%'}}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                {warehouse && warehouse.map((row) => (
                                    <TableRow
                                        key={row?.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row?.id}
                                        </TableCell>
                                        <TableCell align="right">{row?.product_name}</TableCell>
                                        <TableCell align="right">{row?.productType?.name}</TableCell>
                                        <TableCell align="right">{row?.category?.name}</TableCell>
                                        <TableCell align="right">{row?.available_condition}</TableCell>
                                        <TableCell align="right">{row?.maximum_condition}</TableCell>
                                        <TableCell align="right">
                                            <Button variant={"text"} color={"primary"} style={{marginRight: "10px"}} onClick={() => handleEditEntry(row?.id)}>Edytuj</Button>
                                            <Button variant={"outlined"} color={"error"}>Usuń produkt</Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <NewDeliveryDialog />
            </div>
            { editEntryId >= 0 && <EditEntryModal /> }
        </div>
    );
}