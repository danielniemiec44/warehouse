import React, {useLayoutEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import ProductItem from "../Components/ProductItem";
import ProductList from "../Components/ProductList";
import Stack from "@mui/material/Stack";


export const OrdersPage: React.FC = () => {
    const [listHeight, setListHeight] = useState(0);
    const listRef = React.useRef(null);
    const { t } = useTranslation();
    const { data, isLoading, isError } = useQuery("orders", CustomFetchForUseQuery("orders", "GET", null));

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
                return (
                    <Accordion key={`${order.id}`} defaultExpanded={false} sx={{ m: 2 }} elevation={4}>
                        <AccordionSummary>
                            <Stack>
                                <Typography><b>{order.orderNumber}</b> - #{order.id}</Typography>
                                <Typography>Klient o id: {order.buyerId}</Typography>
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