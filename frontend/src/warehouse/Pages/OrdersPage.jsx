import React, {useLayoutEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import ProductItem from "../Components/ProductItem";
import ProductList from "../Components/ProductList";
import Stack from "@mui/material/Stack";
import {customerTypes, useCustomers} from "./CustomersPage";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const paymentStatuses = [
    { value: 'paid', label: 'Opłacone' },
    { value: 'unpaid', label: 'Nieopłacone' },
    { value: 'partially_paid', label: 'Częściowo opłacone' },
    { value: 'pending', label: 'Oczekujące' },
    { value: 'failed', label: 'Nieudane' }
];


export const OrdersPage: React.FC = () => {
    const [listHeight, setListHeight] = useState(0);
    const listRef = React.useRef(null);
    const { t } = useTranslation();
    const { data, isLoading, isError } = useQuery("orders", CustomFetchForUseQuery("orders", "GET", null));
    const { data: customers, isLoading: customersLoading, isError: customersError } = useCustomers();

    useLayoutEffect(() => {
        const calculateHeight = () => {
            // Calculate available height (adjust the subtraction as needed for your layout)
            const windowHeight = window.innerHeight;
            const listTop = listRef.current.offsetTop;
            setListHeight(windowHeight - listTop - 20); // 200px accounts for margins, headers, etc.
        };

        calculateHeight(); // Initial calculation

        window.addEventListener('resize', calculateHeight);
        return () => window.removeEventListener('resize', calculateHeight);
    }, []);

    return (
        <Box sx={{ m: 5, mb: 0 }}>
            <Typography variant={"h5"}>{t("pages.orders")}</Typography>
        <Box sx={{ m: 2, mb: 0, height: listHeight }} style={{ overflow: "auto", boxSizing: "border-box" }} ref={listRef}>
            { data !== undefined && data.map((order) => {
                    const customer = customers?.find((customer) => customer.id === order.buyerId);

// Dane firmy - pierwsza linia
                    const companyInfo = [];
                    if (customer?.companyName) companyInfo.push(customer.companyName);
                    if (customer?.nip) companyInfo.push(`NIP: ${customer.nip}`);
                    const companyLabel = companyInfo.length > 0 ? companyInfo.join(" - ") : "";

// Dane osobowe - druga linia
                    const personInfo = [];
                    if (customer?.customer_name) personInfo.push(customer.customer_name);
                    if (customer?.customer_surname) personInfo.push(customer.customer_surname);
                    const personLabel = personInfo.length > 0 ? personInfo.join(" ") : "";

                    const customerIcon = customerTypes?.find((item) => item.value === customer?.type)?.icon;

                    return (
                    <Accordion key={`${order.id}`} defaultExpanded={false} sx={{ m: 2 }} elevation={4}>
                        <AccordionSummary>
                            <Stack>
                                <Typography><b>{order.orderNumber}</b> (#{order.id})</Typography>
                                <Stack direction="row">
                                {customerIcon}
                                {companyLabel && (
                                    <Typography>
                                        {customer?.companyName && <b>{customer.companyName}</b>}
                                        {customer?.companyName && customer?.nip && " - "}
                                        {customer?.nip && `NIP: ${customer.nip}`}
                                    </Typography>
                                )}

                                {personLabel && <Typography>{personLabel}</Typography>}
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    <FiberManualRecordIcon sx={{ color: "yellow" }} />
                                    <Typography>Płatność: {paymentStatuses?.find((status) => status.value === order?.paymentStatus)?.label}</Typography>
                                </Stack>
                                <Typography>
                                    Metoda płatności: {order?.paymentMethod ?? "Nie podano"}
                                </Typography>
                                </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ProductList
                                saleItems={order.saleItems}
                            />
                        </AccordionDetails>
                    </Accordion>
                )
            }
            )}
        </Box>
        </Box>
    )
}