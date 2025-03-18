const initialState = {
    showAddDeliveryModal: false,
    editEntryId: -1,
    showCategoryList: false,
    editCategoryId: -1,
    showAddCustomerModal: false,
};

interface WarehouseReducerTypes {
    showAddDeliveryModal: boolean;
    editEntryId: number;
    showCategoryList: boolean;
    editCategoryId: number;
}

const modalReducer = (state = initialState, action) => {
    switch (action.type) {
        case "OPEN_ADD_CUSTOMER_MODAL":
            return {
                ...state,
                showAddCustomerModal: true,
            };
        case "CLOSE_ADD_CUSTOMER_MODAL":
            return {
                ...state,
                showAddCustomerModal: initialState.showAddCustomerModal,
            };
        default:
            return state;
    }
};

export { modalReducer };
export type { WarehouseReducerTypes };