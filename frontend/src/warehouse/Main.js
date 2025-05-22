import * as React from 'react';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import {lightGreen, pink, red } from "@mui/material/colors";
import Button from "@mui/material/Button";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SummaryWarehouseStatus from "./SummaryWarehouseStatus";


export default function WarehouseIndex() {
    return (
    <div style={{width: "100%"}}>
        <Grid container spacing={2} sx={{display: 'flex', alignItems: 'center', alignContent: 'center', flexDirection: 'row', justifyContent: 'center'}}>
            <Grid item xs={3}>
                <Paper variant={"outlined"} sx={{ padding: "20px", marginTop: "20px", backgroundColor: red[500], color: "white"}}>
                    <Typography variant={"h5"} style={{}}> <ShoppingCartIcon fontSize={"small"} /> Ilość zamówień</Typography>
                    <Typography variant={"h4"}>0</Typography>
                    <Button color="inherit" variant="outlined" style={{marginTop: "20px"}}>Zobacz zamówienia</Button>

                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper variant={"outlined"} sx={{ padding: "20px", marginTop: "20px", backgroundColor: lightGreen[500], color: "white" }}>
                    <Typography variant={"h5"}><InventoryIcon fontSize={"small"}/> Całkowita ilość zamówień</Typography>
                    <Typography variant={"h4"}>77</Typography>
                    <Button color="inherit" variant="outlined" style={{marginTop: "20px"}}>Utwórz zamówienie</Button>
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper variant={"outlined"} sx={{ padding: "20px", marginTop: "20px", backgroundColor: pink[500], color: "white" }}>
                    <Typography variant={"h5"}><MonetizationOnIcon fontSize={"small"}/> Ostatnia aktualizacja cen </Typography>
                    <Typography variant={"h4"}>29.12.2024</Typography>
                    <Button color="inherit" variant="outlined" style={{marginTop: "20px"}}>Pokaż obecne ceny</Button>
                </Paper>
            </Grid>
        </Grid>

        <SummaryWarehouseStatus />

    </div>
    )
}