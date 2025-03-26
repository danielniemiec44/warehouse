const initialState = {
    showAddDeliveryModal: false,
    editEntryId: -1,
    showCategoryList: false,
    editCategoryId: -1,
    displayCategoryRows: -1,
    productDetailsId: -1,
    saleItems: null,
    showSaleCompletingModal: false,
    filter: [],
    selectedCustomer: null
};

interface WarehouseReducerTypes {
    showAddDeliveryModal: boolean;
    editEntryId: number;
    showCategoryList: boolean;
    editCategoryId: number;
    displayCategoryRows: number;
    productDetailsId: number;
    filter: any;
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
        case 'CLOSE_EDIT_ENTRY_MODAL':
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
        case 'OPEN_PRODUCT_DETAILS_MODAL':
            return {
                ...state,
                productDetailsId: action.payload
            }
        case 'CLOSE_PRODUCT_DETAILS_MODAL':
            return {
                ...state,
                productDetailsId: initialState.productDetailsId
            }
        case 'OPEN_COMPLETING_SALE_MODAL':
            return {
                ...state,
                saleItems: action.payload,
                showSaleCompletingModal: true
            }
        case 'CLOSE_COMPLETING_SALE_MODAL':
            return {
                ...state,
                showSaleCompletingModal: false
            }
        case "CLOSE_COMPLETING_SALE_MODAL_WITH_RESET_QUANTITIES_AND_RESET_CUSTOMER":
            return {
                ...state,
                saleItems: initialState.saleItems,
                showSaleCompletingModal: false,
                selectedCustomer: initialState.selectedCustomer
            }
            case "FILTER_ROWS":
                return {
                    ...state,
                    filter: action.payload
                }
        case "RESET_FILTER_ROWS":
            return {
                ...state,
                filter: initialState.filter
            }
        case "SELECT_CUSTOMER":
            return {
                ...state,
                selectedCustomer: action.payload
            }
        case "RESET_CUSTOMER":
            return {
                ...state,
                selectedCustomer: initialState.selectedCustomer
            }
        default:
            return state;
    }
};

export { warehouseReducer };
export type { WarehouseReducerTypes };