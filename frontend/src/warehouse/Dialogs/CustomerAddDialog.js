import React from "react";

import {useDispatch, useSelector} from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useMutation, useQueryClient} from "react-query";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import eventEmitter from "../Utils/eventEmitter";

export const CustomerAddDialog = () => {
    const open = useSelector((state) => state.modal.showAddCustomerModal);
    const dispatch = useDispatch();
    const [customerData, setCustomerData] = React.useState({
        type: 'company',
        companyName: null,
        nip: null,
        customer_name: null,
        customer_surname: null,
        email: null,
        phone: null,
        address: null,
        postalCode: null,
        city: null
    });

    const companySpecificFields = [
        'companyName',
        'nip'
    ];

    const queryClient = useQueryClient();

    const handleClose = () => {
        dispatch({ type: 'CLOSE_ADD_CUSTOMER_MODAL' });
    };

    const handleChange = (event) => {
        setCustomerData({
            ...customerData,
            [event.target.name]: event.target.value?.length > 0 ? event.target.value : null
        });
    };

    const handleToggleChange = (event, newValue) => {
        if (newValue !== null) {
            setCustomerData({
                ...customerData,
                ...companySpecificFields.reduce((acc, field) => {
                    acc[field] = null;
                    return acc;
                }, {}),
                type: newValue
            });
        }
    };

    const mutation = useMutation(
        (newData) => CustomFetchForUseQuery(`customers`, "POST", newData)(),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["warehouseData", customerData])
                    .then(() => eventEmitter.emit('showSnackbar', { message: 'Klient został dodany', transition: 'slide', variant: 'success' }))
                    .then(() => {/*queryClient.invalidateQueries("")*/})
                    .then(handleClose);
            },
            onError: (error) => {
                eventEmitter.emit('showSnackbar', { message: `${error.errors}\n\n${error.message}`, transition: 'slide', variant: 'error' });
            }
        }
    );

    const handleSubmit = () => {
        mutation.mutate(customerData);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Dodaj klienta</DialogTitle>
            <DialogContent>
                <ToggleButtonGroup
                    value={customerData.type}
                    exclusive
                    onChange={handleToggleChange}
                    fullWidth
                    sx={{ mb: 2, mt: 1 }}
                >
                    <ToggleButton value="company">
                        Firma
                    </ToggleButton>
                    <ToggleButton value="individual">
                        Osoba prywatna
                    </ToggleButton>
                </ToggleButtonGroup>

                {customerData.type === 'company' && (
                    <>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nazwa firmy"
                            type="text"
                            fullWidth
                            name="companyName"
                            value={customerData.companyName}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="NIP"
                            type="text"
                            fullWidth
                            name="nip"
                            value={customerData.nip}
                            onChange={handleChange}
                        />
                        <hr style={{ marginTop: 40, marginBottom: 40 }} />
                    </>
                )}

                <TextField
                    margin="dense"
                    label="Imię"
                    type="text"
                    fullWidth
                    name="customer_name"
                    value={customerData.customer_name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Nazwisko"
                    type="text"
                    fullWidth
                    name="customer_surname"
                    value={customerData.customer_surname}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    name="email"
                    value={customerData.email}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Telefon"
                    type="tel"
                    fullWidth
                    name="phone"
                    value={customerData.phone}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Adres"
                    type="text"
                    fullWidth
                    name="address"
                    value={customerData.address}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Kod pocztowy"
                    type="text"
                    fullWidth
                    name="postalCode"
                    value={customerData.postalCode}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Miasto"
                    type="text"
                    fullWidth
                    name="city"
                    value={customerData.city}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Anuluj</Button>
                <Button onClick={handleSubmit} color="primary">Dodaj</Button>
            </DialogActions>
        </Dialog>
    );
}