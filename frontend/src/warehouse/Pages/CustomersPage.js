import React, {useEffect, useState} from 'react';
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
import {useQuery} from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const CustomersPage = () => {
    const dispatch = useDispatch();
    const showAddCustomerModal = useSelector((state) => state.modal.showAddCustomerModal);
    const { data, isLoading, isError } = useQuery("customers", CustomFetchForUseQuery("customers", "GET", null)); // Use the returned function.
    const customerTypes = [
        {
            value: 'company',
            label: 'Firma',
            icon: <BusinessIcon />
        },
        {
            value: 'individual',
            label: 'Osoba prywatna',
            icon: <PersonIcon />
        }
    ];
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const mainView = React.useRef(null);
    const [listHeight, setListHeight] = React.useState(0)

    useEffect(() => {
        setListHeight(window.innerHeight - 200);
        if (!mainView.current) return;

        const handleViewportChange = () => {
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

            mainView.current.scrollTo({
                left: selectedCustomer ? vw : 0,
                behavior: "smooth"
            });
        };

        handleViewportChange(); // Initial scroll
        window.addEventListener('resize', handleViewportChange);

        return () => {
            window.removeEventListener('resize', handleViewportChange);
        };
    }, [selectedCustomer]);


    const renderRow = ({ index, style }) => {
        const row = data[index];

        return (
            <Box style={style}>
                <Paper elevation={4} style={{ padding: 10, margin: 10, boxSizing: "border-box", height: "80%", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setSelectedCustomer(row)}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            { customerTypes?.find((type) => type?.value === row?.type)?.icon }
                        </Avatar>
                        <Box>
                            <Typography variant="h6">{row?.customer_name} {row?.customer_surname}</Typography>
                            <Typography variant="body1">{row?.companyName}</Typography>
                            <Stack direction={"row"} spacing={2}>
                                <Typography variant="body2">{row?.email ?? "Brak adresu e-mail"}</Typography>
                                <Typography variant="body">•</Typography>
                                <Typography variant="body2">{row?.phone}</Typography>
                            </Stack>
                        </Box>
                    </Stack>
                        <NavigateNextIcon fontSize="large" />
                </Paper>
            </Box>
        );
    };

    return (
        <div>
            <div style={{width: '100%', height: "calc(100vh - 200px)", padding: 20, boxSizing: 'border-box', overflow: 'hidden', position: 'relative'}} ref={mainView}>
                <div style={{
                    position: "absolute",
                    width: '100%',
                    padding: 20,
                    boxSizing: 'border-box',
                    left: "100vw",
                }}>
                    <Box width="fit-content">
                    <Stack direction={"column"} style={{ justifyContent: "start" }} spacing={5} justifyContent={"start"}>
                        <Button fullWidth={false} onClick={() => setSelectedCustomer(null)}>
                            <Stack direction={"row"} spacing={1}>
                                <ArrowBackIosIcon />
                                <Typography>Powrót do listy klientów</Typography>
                            </Stack>
                        </Button>
                        <Paper style={{ margin: 30, padding: 30 }} elevation={4}>
                            <Typography variant={"h6"}>
                            {selectedCustomer?.customer_name} {selectedCustomer?.customer_surname}
                            </Typography>
                            <Typography variant={"body1"}>
                            {selectedCustomer?.companyName}
                            </Typography>
                            <Typography variant={"body2"}>
                                <b>Adres E-mail: </b> {selectedCustomer?.email}
                            </Typography>
                            <Typography variant={"body2"}>
                                <b>Numer telefonu: </b> {selectedCustomer?.phone}
                            </Typography>

                            {/*the rest of customers properties - address, postalCode, city, */}
                            <Typography variant={"body2"}>
                                <b>Adres:</b> {selectedCustomer?.address}
                            </Typography>
                            <Typography variant={"body2"}>
                                <b>Kod pocztowy:</b> {selectedCustomer?.postalCode}
                            </Typography>
                            <Typography variant={"body2"}>
                                <b>Miejscowość:</b> {selectedCustomer?.city}
                            </Typography>
                        </Paper>
                    </Stack>
                    </Box>
                </div>
                <Box px={1} width="100%"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10}}>
                    <TextField id="standard-basic" label="Wyszukaj klienta" variant="outlined" fullWidth/>
                    <SquareButton size={55} style={{fontSize: 30}} variant={"outlined"} onClick={() => {
                        dispatch({type: "OPEN_ADD_CUSTOMER_MODAL"})
                    }}>+</SquareButton>
                </Box>
                        <FixedSizeList
                            height={listHeight}
                            width={"100%"}
                            itemCount={data?.length || 0}
                            itemSize={100}
                        >
                            {renderRow}
                        </FixedSizeList>
            </div>
            {showAddCustomerModal && <CustomerAddDialog/>}
        </div>
    )
}

export default CustomersPage;