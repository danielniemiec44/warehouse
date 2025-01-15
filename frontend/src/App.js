import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Order from './NewOrder';
import Main from './warehouse/Main';
import AddDelivery from './warehouse/Actions/AddDelivery';
import {SnackbarProvider} from "notistack";
import { Provider } from 'react-redux';
import store from './warehouse/Utils/store';
import PrivateRoute from "./warehouse/PrivateRoute";
import WarehouseIndex from "./warehouse/Pages/WarehouseIndex";
import CustomizedSnackbar from "./warehouse/Utils/CustomizedSnackbar";
import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 3, // Set retry to 1 globally
                retryDelay: 1000, // 2-second delay
            },
        },
    });


    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
            <div className="App">
            <SnackbarProvider maxSnack={3}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/orders" element={<Order />} />
                    <Route path="/warehouse" element={<PrivateRoute><WarehouseIndex /></PrivateRoute>} />
                    <Route path="/main"  element={<PrivateRoute><Main /></PrivateRoute>} />
                    <Route path="/adddelivery" element={<PrivateRoute><AddDelivery /></PrivateRoute>} />
                </Routes>
            </Router>
                <CustomizedSnackbar />
            </SnackbarProvider>
        </div>
            </QueryClientProvider>
        </Provider>
    );
}
export default App;