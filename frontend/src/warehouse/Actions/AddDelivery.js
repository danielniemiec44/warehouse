import React from 'react';
import AppBar from "../AppBar";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function AddDelivery() {

    const [productName, setProductName] = React.useState("");
    const [productAmount, setProductAmount] = React.useState("");
    const [productCategory, setProductCategory] = React.useState("");

    const handleChangeName = (event) => {
        setProductName(event.target.value);
    }

    const handleChangeAmount = (event) => {
        setProductAmount(event.target.value);
    }

    const handleChangeCategory = (event) => {
        setProductCategory(event.target.value);
    }

    const [conditionOfProduct, setConditionOfProduct] = React.useState("");

    return(
        <div>
            <AppBar/>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                marginTop: "20px"
            }}>
                <Typography variant={'h5'}> Zarządzanie stanami magazynowymi </Typography>
                <div>
                    <Button variant={"contained"} color={"primary"} style={{marginRight: "10px"}}>Dodaj dostawę</Button>
                    <Button variant={"outlined"} color={"primary"}>Usuń produkt</Button>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px'
            }}>
                <Paper elevation={3} sx={{padding: "20px", width: "600px", height: "auto"}}>
                    <Stack spacing={2}>
                        <TextField variant={"standard"} fullWidth label={"Nazwa produktu"} value={productName}
                                   onChange={handleChangeName}/>
                        <FormControl fullWidth>
                            <InputLabel id="product-category-label">Wybierz produkt</InputLabel>
                            <Select
                                labelId="product-category-label"
                                value={productCategory}
                                label="Wybierz produkt"
                                onChange={handleChangeCategory}
                            >
                                <MenuItem value={"aroma"}>Aromat</MenuItem>
                                <MenuItem value={"base"}>Baza beznikotynowa</MenuItem>
                                <MenuItem value={"salt"}>Sól nikotynowa</MenuItem>
                                <MenuItem value={"nicotine"}>Nikotyna</MenuItem>
                                <MenuItem value={"bottle"}>Butelki</MenuItem>
                            </Select>
                        </FormControl>
                        <React.Fragment>
                            {productCategory && (
                                <TextField
                                    variant={"standard"}
                                    fullWidth
                                    label={productCategory === "bottle" ? "Ilość w sztukach" : "Ilość w ml"}
                                    value={productAmount}
                                    onChange={handleChangeAmount}
                                />
                            )}
                        </React.Fragment>

                        <Stack spacing={2}>
                            <Button variant={"contained"} color={"primary"}>Dodaj produkt</Button>
                            <Button variant={"outlined"} color={"secondary"}>Dodaj produkt i zostań na stronie </Button>
                        </Stack>

                    </Stack>
                </Paper>
            </div>
        </div>
    )
}