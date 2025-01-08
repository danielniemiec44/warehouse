import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function SummaryWarehouseStatus() {
    function createData(name, category, quantity) {
        return { name, category, quantity };
    }

    const rows = [
        createData('Sól nikotynowa', 'Surowce', 6.0),
        createData('Nikotyna w płynie', 'Surowce', 9.0),
        createData('Aromaty', 'Surowce', 16.0),
        createData('Nikotyna', 'Surowce', 3.7),
        createData('Butelki', 'Surowce', 16.0),
    ];


    return (
        <div style={{marginTop: "20px", maxWidth: "100%", display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', alignItems: 'center', justifyItems: 'center'}}>
            <TableContainer component={Box} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Table sx={{ maxWidth: "70%"}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Wszystkie magazyny</TableCell>
                            <TableCell align="right">Kategoria</TableCell>
                            <TableCell align="right">Dostępny stan</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.category}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}