const initialState = {
    showAddDeliveryModal: false,
    editEntryId: -1
};

const deliveryReducer = (state = initialState, action) => {
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
            }
        default:
            return state;
    }
};

export default deliveryReducer;