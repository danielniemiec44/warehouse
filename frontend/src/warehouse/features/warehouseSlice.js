import { createSlice } from "@reduxjs/toolkit";

const warehouseSlice = createSlice({
    name: "warehouse",
    initialState: {
        products: [],
        editEntryId: -1
    },
    reducers: {
        setEditEntryId: (state, action) => {
            state.editEntryId = action.payload;
        },
        clearEditEntryId: (state) => {
            state.editEntryId = -1;
        }
    }
});

export const { setEditEntryId, clearEditEntryId } = warehouseSlice.actions;
export default warehouseSlice.reducer;
