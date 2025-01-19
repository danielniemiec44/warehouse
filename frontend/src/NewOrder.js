import React from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import NewOrderDialog from "./warehouse/Dialogs/NewOrderDialog";
export default function NewOrder() {

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

    const [quantity, setQuantity] = React.useState(1);

    const handleChange = (event) => {
        setQuantity(event.target.value);
    };

    return (
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Grid container spacing={3} style={{padding: 20}}>
              <Grid item xs={12} xxl={6} lg={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} style={{ padding: 20, alignContent: 'center', textAlign: 'center' }}>
                    <Typography variant="h4" color="white" fullWidth> Nowe zamówienie </Typography>
                    <Typography variant="body1" color="white" fullWidth> W tym miejscu utworzysz nowe zamówienie ze swoimi ulubionymi smakami,
                    możesz wybrać dokładny mix bądź indywidualne smak każdej butelki. </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} xxl={6} lg={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Paper elevation={3} style={{ padding: 20, alignContent: 'center', textAlign: 'center' }}>
                <Typography variant="h4" color="white" fullWidth> Dane kupującego </Typography>
                <TextField id="standard-basic" label="Imię" variant="standard" style={{ margin: 10 }} fullWidth />
                <TextField id="standard-basic" label="Nazwisko" variant="standard" style={{ margin: 10 }} fullWidth />
                <TextField id="standard-basic" type="number" label="Nr telefonu" variant="standard" style={{ margin: 10 }} fullWidth />
              </Paper>
              </Grid>
              <Grid item xs={12} xxl={6} lg={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Paper elevation={3} style={{ padding: 20, alignContent: 'center', textAlign: 'center' }}>
                <Typography variant="h4" color="white" fullWidth> Określ ilość </Typography>
                  <Typography variant="body1" color="white" fullWidth> Wybierz ilość butelek, które chcesz zamówić </Typography>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" value={quantity} onChange={handleChange}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                </Paper>
              </Grid>

              <Grid item xs={12} xxl={6} lg={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Paper elevation={3} style={{ padding: 20, alignContent: 'center', textAlign: 'center' }}>
                <Typography variant="h4" color="white" fullWidth> Zdefiniuj zawartość </Typography>
                  <Typography variant="body1" color="white" fullWidth> Zamawiasz butelki wypełnione cieczą do trasnportu, określ jaka to ma być ciecz. </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} xxl={6} lg={6}>
                      <TextField id="standard-basic" label="Ciecz" variant="standard" style={{ margin: 10 }} fullWidth disabled />
                    </Grid>
                    <Grid item xs={12} xxl={6} lg={6}>
                      <Fab color="secondary" aria-label="add" size="small" style={{ margin: 10 }}>
                        <AddIcon />
                      </Fab>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} xxl={6} lg={6}>
                      <TextField id="standard-basic" label="Ciecz" variant="standard" style={{ margin: 10 }} fullWidth disabled />
                    </Grid>
                    <Grid item xs={12} xxl={6} lg={6}>
                      <Fab color="secondary" aria-label="add" size="small" style={{ margin: 10 }}>
                        <AddIcon />
                      </Fab>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} xxl={6} lg={6}>
                      <TextField id="standard-basic" label="Ciecz" variant="standard" style={{ margin: 10 }} fullWidth disabled />
                    </Grid>
                    <Grid item xs={12} xxl={6} lg={6}>
                      <Fab color="secondary" aria-label="add" size="small" style={{ margin: 10 }}>
                        <AddIcon />
                      </Fab>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid container spacing={3} style={{padding: 20}}>
                <Grid item xs={12} xxl={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Paper elevation={3} style={{ padding: 20, alignContent: 'center', textAlign: 'center' }}>
                    <Typography variant="h4" color="white" fullWidth> Podsumowanie </Typography>
                    <Typography variant="body1" color="white" fullWidth> Do zapłaty będzie: ... zł  </Typography>
                    <Button variant="contained" color="primary" style={{ margin: 10 }}>
                    Zamawiam z obowiązkiem zapłaty
                    </Button>
                  </Paper>

                </Grid>
              </Grid>

          </Grid>
        </Box>

            <NewOrderDialog />
      </ThemeProvider>
 )
}