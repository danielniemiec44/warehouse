import { combineReducers } from 'redux';
import userReducer from './userReducer';
import { warehouseReducer } from './warehouseReducer';
import { modalReducer } from './modalReducer';

const rootReducer = combineReducers({
    user: userReducer,
    warehouse: warehouseReducer,
    modal: modalReducer
});

export type RootReducerTypes = ReturnType<typeof rootReducer>;
export default rootReducer;