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

export const useCustomers = () => {
    return useQuery("customers", CustomFetchForUseQuery("customers", "GET", null));
};

export const customerTypes = [
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

const CustomersPage = () => {
    const dispatch = useDispatch();
    const showAddCustomerModal = useSelector((state) => state.modal.showAddCustomerModal);
    const { data, isLoading, isError } = useCustomers();
    const selectedCustomer = useSelector((state) => state.warehouse.selectedCustomer);
    const mainView = React.useRef(null);
    const [listHeight, setListHeight] = React.useState(0)
    const [listWidth, setListWidth] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const dataList = React.useRef(null);
    const customerPageRef = React.useRef(null);
    // Add a new ref for the DOM element
    const listOuterRef = React.useRef(null);

    useEffect(() => {
        if (!listOuterRef.current) return;

        const calculateHeight = () => {
            const rect = listOuterRef.current.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;

            setListHeight(window.innerHeight - absoluteTop - 20);

            const parent  = customerPageRef.current
            console.log("Customers page parent:", parent);
            setListWidth(parent.clientWidth - 40);
            console.log("List height: ", window.innerHeight - absoluteTop - 20);
        };

        // Calculate height immediately
        calculateHeight();

        // Recalculate on resize
        window.addEventListener('resize', calculateHeight);

        // Handle viewport scrolling for customer selection
        const handleViewportChange = () => {
            if (!mainView.current) return;
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

            mainView.current.scrollTo({
                left: selectedCustomer ? vw : 0,
                behavior: "smooth"
            });
        };

        handleViewportChange();
        window.addEventListener('resize', handleViewportChange);

        return () => {
            window.removeEventListener('resize', calculateHeight);
            window.removeEventListener('resize', handleViewportChange);
        };
    }, [selectedCustomer, mainView, listOuterRef]);

    const searchData = React.useMemo(() => {
        const searchKeywords = search.toLowerCase().split(" ").filter(keyword => keyword.length > 0);

        if (searchKeywords.length === 0) return data;

        return data?.filter((customer) => {
            const customerData = [
                customer.customer_name,
                customer.customer_surname,
                customer.companyName,
                customer.email,
                customer.phone,
                customer.address,
                customer.postalCode,
                customer.city,
                customer.nip
            ].join(' ').toLowerCase();

            return searchKeywords.every(keyword => customerData.includes(keyword));
        });
    }, [data, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }


    const renderRow = ({ index, style }) => {
        const row = searchData[index];

        return (
            <Box style={style}>
                <Paper elevation={4} style={{ padding: 10, margin: 10, boxSizing: "border-box", height: "80%", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => { dispatch({ "type": "SELECT_CUSTOMER", payload: row }) }}>
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
        <div ref={customerPageRef} style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <div style={{width: '100%', height: listHeight, padding: 20, boxSizing: 'border-box', overflow: 'hidden', position: 'relative'}} ref={mainView}>
                <div style={{
                    position: "absolute",
                    width: '100%',
                    padding: 20,
                    boxSizing: 'border-box',
                    left: "100vw",
                }}>
                    <Box width="fit-content">
                    <Stack direction={"column"} style={{ justifyContent: "start" }} spacing={5} justifyContent={"start"}>
                        <Button fullWidth={false} onClick={() => { dispatch({ type: "RESET_CUSTOMER" }) }}>
                            <Stack direction={"row"} spacing={1}>
                                <ArrowBackIosIcon />
                                <Typography>Powrót do listy klientów</Typography>
                            </Stack>
                        </Button>
                        <Paper style={{ margin: 30, padding: 30 }} elevation={4}>
                            <Stack>
                                {customerTypes.find((type) => type.value === selectedCustomer?.type)?.icon}
                                <div>
                                    <Typography variant={"h6"}>
                                    {selectedCustomer?.customer_name} {selectedCustomer?.customer_surname}
                                    </Typography>
                                    <Typography variant={"body1"}>
                                    {selectedCustomer?.companyName}
                                    </Typography>
                                    <Typography variant={"body1"}>
                                        {selectedCustomer?.nip !== null && <div><b>NIP:</b> {selectedCustomer?.nip}</div>}
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
                                </div>
                            </Stack>
                        </Paper>
                    </Stack>
                    </Box>
                </div>
                <Box px={1} width="100%"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10}}>
                    <TextField id="standard-basic" label="Wyszukaj klienta" variant="outlined" fullWidth value={search} onChange={handleSearchChange} />
                    <SquareButton size={55} style={{fontSize: 30}} variant={"outlined"} onClick={() => {
                        dispatch({type: "OPEN_ADD_CUSTOMER_MODAL"})
                    }}>+</SquareButton>
                </Box>
                <Box>

                        <FixedSizeList
                            height={listHeight - 80}
                            width={listWidth}
                            itemCount={searchData?.length || 0}
                            itemSize={100}
                            ref={dataList}
                            outerRef={listOuterRef}
                        >
                            {renderRow}
                        </FixedSizeList>
                </Box>
            </div>
            {showAddCustomerModal && <CustomerAddDialog/>}
        </div>
    )
}

export default CustomersPage;