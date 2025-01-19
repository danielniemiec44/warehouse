const initialState = {
    user: null,
    isAuthenticated: false,
};

interface UserReducerTypes {
    user: null | {
        id: number;
        username: string;
        email: string;
        token: string;
    };
    isAuthenticated: boolean;
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

export default userReducer;
export type { UserReducerTypes };