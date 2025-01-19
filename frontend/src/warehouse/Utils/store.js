import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../Reducers/index.ts';

const store = configureStore({
    reducer: rootReducer,
});

export default store;