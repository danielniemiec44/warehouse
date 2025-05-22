import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import DialogContent from "@mui/material/DialogContent";
import {t} from "i18next";
import Dialog from "@mui/material/Dialog";
import {LineChart} from '@mui/x-charts/LineChart';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {useDispatch} from "react-redux";
import DatePickerValue from "../Components/DatePickerValue";

function ProductDetails() {
    const dispatch = useDispatch();


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
                    <Box>
                        <DatePickerValue />
                    </Box>
                <LineChart
                    height={300}
                    series={chartData.series}
                    xAxis={chartData.xAxis}
                    margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                />
        <Box style={{ display: "flex", justifyContent: "center" }}>
            <Button variant={"contained"} fullWidth>Zakup do magazynu</Button>
        </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetails;