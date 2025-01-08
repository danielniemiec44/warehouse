import { combineReducers } from 'redux';
import userReducer from './userReducer';
import deliveryReducer from "./deliveryReducer";

const rootReducer = combineReducers({
    user: userReducer,
    delivery: deliveryReducer
});

export default rootReducer;