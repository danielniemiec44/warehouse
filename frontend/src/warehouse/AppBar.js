import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { teal } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import eventEmitter from "./Utils/eventEmitter";

const drawerWidth = 240;
const navItems = ['Home', 'Sklep', 'Regulamin', 'Kontakt do nas'];

const navigationMap = [
    { name: 'Strona główna', path: '/main' },
    { name: 'Magazyn', path: '/warehouse' },
    { name: 'Zamówienia', path: '/orders' },
    { name: 'Eksport', path: '/exports' },
    { name: 'Importuj dane', path: '/imports' },
    { name: 'Ustawienia systemu', path: '/settings' },
    { name: 'Panel', path: '/panel' },
];

// Create a theme with dark mode

function DrawerAppBar(props) {
    const { window, children } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const user = useSelector((state) => state.user.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const logOut = () => {
        sessionStorage.removeItem('user')
        dispatch({ type: 'LOGOUT'});
        eventEmitter.emit('showSnackbar', { message: `Pomyślnie wylogowano.`, transition: 'slide', variant: 'success' });
        navigate("/", {replace: true});
    }

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleScroll = () => {
                const appBar = document.querySelector('.MuiAppBar-root');
                if (window.scrollY === 0) {
                    appBar.style.opacity = '1';
                } else {
                    appBar.style.opacity = '0.6';
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }} component={Link} to={item === 'Shop' ? '/shop' : '/'}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    component="nav"
                    sx={{
                        backgroundImage: `linear-gradient(to bottom, ${teal[500]} 0%, ${teal[500]}CC 50%, ${teal[500]}00 100%)`,
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {navigationMap.map((item) => (
                                <Button
                                    key={item.name}
                                    sx={{ color: '#fff' }}
                                    component={Link}
                                    to={item.path}
                                    className='nav-button-customized'
                                >
                                    {item.name}
                                </Button>
                            ))}
                        </Box>
                        <Button variant={'contained'} color={'secondary'} sx={{ marginLeft: 'auto' }} onClick={() => { logOut(); }}>Wyloguj ({user?.username})</Button>
                    </Toolbar>
                </AppBar>
                <nav>
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </nav>
                <Box component="main" sx={{ flexGrow: 1, pb: 0 }}>
                    <Toolbar />
                    {children}
                </Box>
            </Box>
    );
}

DrawerAppBar.propTypes = {
    window: PropTypes.func,
    children: PropTypes.node,
};

export default function Nav(props) {
    return (
        <DrawerAppBar {...props} />
    );
}