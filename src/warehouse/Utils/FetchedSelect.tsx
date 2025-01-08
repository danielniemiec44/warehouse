import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, Select, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import useCustomFetch from "./CustomFetchForUseQuery";

interface DataItem {
    value: string;
    name: string;
}

interface FetchedSelectProps {
    defaultValue: string;
    queryName: string;
    endpoint: string;
    method?: string;
    body?: object;
}

export default function FetchedSelect({ defaultValue, queryName, endpoint, method = "GET", body = null }: FetchedSelectProps) {
    const { t } = useTranslation();
    const fetchData = useCustomFetch(endpoint, method, body); // Directly call the hook.

    const { data, isLoading, isError } = useQuery<DataItem[]>(queryName, fetchData); // Use the returned function.

    if (isError) {
        return <div>{t("errors.fetchingDataError", { queryName })}</div>;
    }

    if (isLoading) {
        return <Skeleton />;
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="product_type_label">{t("warehouse.product_type")}</InputLabel>
            <Select
                labelId="product_type_label"
                id="product_type_select"
                defaultValue={defaultValue}
                label={t("warehouse.product_type")}
            >
                <MenuItem value="">
                    <em>Brak wyboru</em>
                </MenuItem>
                {data && data.map((row, index) => (
                    <MenuItem key={index} value={row.value}>{row.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

FetchedSelect.propTypes = {
    defaultValue: PropTypes.any,
    queryName: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    method: PropTypes.string,
    body: PropTypes.object,
};
