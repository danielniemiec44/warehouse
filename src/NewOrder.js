import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import {Autocomplete, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export default function NewOrder() {

    const quantityValue = Array.from({ length: 10 }, (_, i) => i + 1);

    const [deliveryStatus, setDeliveryStatus] = React.useState("");
    const handleDeliveryStatus = (event) => {
        setDeliveryStatus(event.target.value);
    }

    const typeMap = ["Sól", "Nikotyna"];
    const [type, setType] = React.useState("");
    const handleChangeType = (event) => {
        setType(event.target.value);
    }

    const [quantity, setQuantity] = React.useState("");
    const handleChangeQuantity = (event) => {
        setQuantity(event.target.value);
    }

    const flavours = [
        "Mentol", "Truskawka", "Pomarańcz"
    ]



    return (
    <div>
        <React.Fragment>
            <Box style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100vh", width: "100%", backgroundImage: "url(https://www.mintsoft.com/media/chzlxsn3/types_of_warehouse_blog.png?width=1200&height=630&v=1dab8149acd8d70)", backgroundSize: "cover" }}>
                <Paper elevation={3} sx={{ marginTop: "25px", padding: "25px", width: "300px", height: "auto" }}>
                    <Typography variant={"h5"}>Nowe zamówienie</Typography>
                    <Typography variant={"body1"}>Tu utworzysz nowe zamówienie, aby tego dokonać uzupełnij poniższy formularz odpowiednimi danymi.</Typography>
                </Paper>


                <Grid container spacing={2} style={{display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                    <Grid item xs={6}>
                        <Paper elevation={3} sx={{ marginTop: "25px", padding: "25px", width: "600px", height: "auto" }}>

                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper elevation={3} sx={{ marginTop: "25px", padding: "25px", width: "600px", height: "auto" }}>

                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    </div>
 )
}