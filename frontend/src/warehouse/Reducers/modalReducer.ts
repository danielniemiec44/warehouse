const initialState = {
    showAddDeliveryModal: false,
    editEntryId: -1,
    showCategoryList: false,
    editCategoryId: -1
};

interface WarehouseReducerTypes {
    showAddDeliveryModal: boolean;
    editEntryId: number;
    showCategoryList: boolean;
    editCategoryId: number;
}

const modalReducer = (state = initialState, action) => {
    switch (action.type) {

        default:
            return state;
    }
};

export { modalReducer };
export type { WarehouseReducerTypes };