import Typography from '@mui/material/Typography';
import AppBar from "../AppBar";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function SystemSettings() { 
    return (
        <div>
            <AppBar />
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginTop: "20px"}}>
                        <div>
                            <Typography variant="h4" component="h4">
                                Ustawienia systemowe
                            </Typography>
                        </div>
                        <div>
                            <Button variant="contained" sx={{mr: 1}}>Użytkownicy</Button>
                            <Button variant="outlined">Dane firmy</Button>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}