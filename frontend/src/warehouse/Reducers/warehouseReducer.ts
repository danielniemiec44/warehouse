const initialState = {
    showAddDeliveryModal: false,
    editEntryId: -1,
    showCategoryList: false,
    editCategoryId: -1,
    displayCategoryRows: -1
};

interface WarehouseReducerTypes {
    showAddDeliveryModal: boolean;
    editEntryId: number;
    showCategoryList: boolean;
    editCategoryId: number;
    displayCategoryRows: number;
}

const warehouseReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_ADD_DELIVERY_MODAL':
            return {
                ...state,
                showAddDeliveryModal: true
            };
        case 'CLOSE_ADD_DELIVERY_MODAL':
            return {
                ...state,
                showAddDeliveryModal: false
            };
        case 'OPEN_EDIT_ENTRY_MODAL':
            return {
                ...state,
                editEntryId: action.payload
            };
        case 'CLOSE_EDIT_DELIVERY_MODAL':
            return {
                ...state,
                editEntryId: initialState.editEntryId
            };
        case 'OPEN_CATEGORY_LIST_MODAL':
            return {
                ...state,
                showCategoryList: true
            };
        case 'CLOSE_CATEGORY_LIST_MODAL':
            return {
                ...state,
                showCategoryList: false
            }
        case 'OPEN_EDIT_CATEGORY_MODAL':
            return {
                ...state,
                editCategoryId: action.payload
            }
        case 'CLOSE_EDIT_CATEGORY_MODAL':
            return {
                ...state,
                editCategoryId: initialState.editCategoryId
            }
        case 'SELECT_DISPLAY_CATEGORY_ROWS':
            return {
                ...state,
                displayCategoryRows: action.payload
            }
        default:
            return state;
    }
};

export { warehouseReducer };
export type { WarehouseReducerTypes };