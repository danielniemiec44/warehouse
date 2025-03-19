import React from 'react';
import AppBar from "../AppBar";
import {FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Paper from "@mui/material/Paper";
import {Avatar, Box} from "@mui/material";
import Stack from "@mui/material/Stack";
import BusinessIcon from '@mui/icons-material/Business';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SquareButton from "../Utils/SquareButton";
import {useDispatch, useSelector} from "react-redux";
import {CustomerAddDialog} from "../Dialogs/CustomerAddDialog";


const CustomersPage = () => {
    const dispatch = useDispatch();
    const showAddCustomerModal = useSelector((state) => state.modal.showAddCustomerModal);

    const renderRow = ({ index, style }) => {
        return (
            <Box style={style}>
                <Paper elevation={4} style={{ padding: 10, margin: 10, boxSizing: "border-box" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <BusinessIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Nazwa firmy
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        );
    };

    return (
        <div>
            <AppBar />
            <div style={{height: 'calc(100vh - 80px)', width: '100%', padding: 20, boxSizing: 'border-box'}}>
                <Box px={1} width="100%" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <TextField id="standard-basic" label="Wyszukaj klienta" variant="outlined" fullWidth />
                    <SquareButton size={55} style={{ fontSize: 30 }} variant={"outlined"} onClick={() => { dispatch({ type: "OPEN_ADD_CUSTOMER_MODAL" })}}>+</SquareButton>
                </Box>
                    <AutoSizer disableWidth>
                {({ height }) => (
            <FixedSizeList
                height={height}
                width={"100%"}
                itemCount={5}
                itemSize={100}
            >
                {renderRow}
            </FixedSizeList>
                )}
            </AutoSizer>
            </div>
            {showAddCustomerModal && <CustomerAddDialog />}
        </div>
    )
}

export default CustomersPage;