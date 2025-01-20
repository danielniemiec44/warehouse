import { combineReducers } from 'redux';
import userReducer from './userReducer';
import { warehouseReducer } from './warehouseReducer';

const rootReducer = combineReducers({
    user: userReducer,
    warehouse: warehouseReducer
});

export type RootReducerTypes = ReturnType<typeof rootReducer>;
export default rootReducer;