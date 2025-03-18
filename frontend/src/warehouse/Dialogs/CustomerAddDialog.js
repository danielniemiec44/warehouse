import React from "react";

import {useDispatch, useSelector} from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

export const CustomerAddDialog = () => {
    const open = useSelector((state) => state.modal.showAddCustomerModal);
    const dispatch = useDispatch();
    const [customerData, setCustomerData] = React.useState({
        companyOrIndividual: 'company',
        companyName: '',
        nip: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        city: ''
    });

    const handleClose = () => {
        dispatch({ type: 'CLOSE_ADD_CUSTOMER_MODAL' });
    };

    const handleChange = (event) => {
        setCustomerData({
            ...customerData,
            [event.target.name]: event.target.value
        });
    };

    const handleToggleChange = (event, newValue) => {
        if (newValue !== null) {
            setCustomerData({
                ...customerData,
                companyOrIndividual: newValue
            });
        }
    };

    const handleSubmit = () => {
        dispatch({
            type: 'ADD_CUSTOMER',
            payload: customerData
        });
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Dodaj klienta</DialogTitle>
            <DialogContent>
                <ToggleButtonGroup
                    value={customerData.companyOrIndividual}
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

                {customerData.companyOrIndividual === 'company' && (
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
                    </>
                )}

                <TextField
                    margin="dense"
                    label="Imię"
                    type="text"
                    fullWidth
                    name="firstName"
                    value={customerData.firstName}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Nazwisko"
                    type="text"
                    fullWidth
                    name="lastName"
                    value={customerData.lastName}
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