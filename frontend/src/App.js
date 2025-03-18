import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import PrivateRoute from './warehouse/PrivateRoute';
import Login from './Login';
import Order from './NewOrder';
import WarehouseIndex from './warehouse/Pages/WarehouseIndex';
import Main from './warehouse/Main';
import AddDelivery from './warehouse/Actions/AddDelivery';
import CustomizedSnackbar from './warehouse/Utils/CustomizedSnackbar';
import EditWarehouseModal from './warehouse/Components/EditWarehouseModal';
import Panel from './warehouse/panel';
import CustomersPage from "./warehouse/Pages/CustomersPage";
import {createTheme, ThemeProvider} from "@mui/material/styles";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: 1000,
      },
    },
  });

  const editEntryId = useSelector((state) => state.warehouse.editEntryId);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
    });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <SnackbarProvider maxSnack={3}>
          <ThemeProvider theme={lightTheme}>
          <Router>
            <Routes>
              <Route path="/" element={<PrivateRoute><Login /></PrivateRoute>} />
              <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
              <Route path="/warehouse" element={<PrivateRoute><WarehouseIndex /></PrivateRoute>} />
              <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
              <Route path="/panel" element={<PrivateRoute><Panel /></PrivateRoute>} />
              <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
            </Routes>
          </Router>
          </ThemeProvider>
          <CustomizedSnackbar />
        </SnackbarProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;