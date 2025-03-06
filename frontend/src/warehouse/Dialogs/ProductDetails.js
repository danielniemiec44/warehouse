import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import DialogContent from "@mui/material/DialogContent";
import {t} from "i18next";
import Dialog from "@mui/material/Dialog";
import { LineChart } from '@mui/x-charts/LineChart';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Grid from "@mui/material/Grid";
import {ListSubheader} from "@mui/material";
import Typography from "@mui/material/Typography";
import PanoramaIcon from '@mui/icons-material/Panorama';
import ListItemIcon from "@mui/material/ListItemIcon";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {useDispatch} from "react-redux";

function ProductDetails() {
    const dispatch = useDispatch();

    const views = [{
        name: "months",
        label: 'months',
        },
        {
          name: "years",
            label: "years"
        },
        {
            name: "weeks",
            label: "weeks"
        },
        {
            name: "days",
            label: "days"
        }
    ]


    // Example data - replace with your actual data
    const chartData = {
        xAxis: [
            { data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                scaleType: 'band' }
        ],
        series: [
            {
                data: [30, 40, 45, 50, 49, 60],
                label: 'Buys',
                color: '#2196f3'
            },
            {
                data: [25, 35, 40, 45, 48, 55],
                label: 'Sells',
                color: '#4caf50'
            }
        ]
    };

    return (
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"md"}
            fullWidth
            onClose={() => { dispatch({ type: "CLOSE_PRODUCT_DETAILS_MODAL" }) }}
        >
            <DialogTitle id="alert-dialog-title">
                {t("dialogTitles.product_details")}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={5}>
                <Grid container spacing={5} Spacing={100}>
                    <Grid item md={3} xs={12}>
                <List>
                    <Typography variant="body1" component="div" gutterBottom>
                        {t("warehouse.view_type")}:
                    </Typography>
                    {views.map((view) => (
                        <ListItem key={view.name}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PanoramaIcon />
                                </ListItemIcon>
                                {view.label}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                    </Grid>
                    <Grid item md={9} xs={12}>
                <LineChart
                    height={300}
                    series={chartData.series}
                    xAxis={chartData.xAxis}
                    margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                />
                    </Grid>
                </Grid>
        <Box style={{ display: "flex", justifyContent: "center" }}>
            <Button variant={"contained"} fullWidth>Zakup do magazynu</Button>
        </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetails;