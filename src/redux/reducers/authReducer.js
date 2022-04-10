const initState = {
    errors: {
        signUp: null,
        signIn: null
    },
    role: null
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNUP_ERROR":
            return {
                ...initState,
                errors: {...initState.errors, signUp: action.payload.error},
            };

        case "SIGNIN_ERROR":
            return {
                ...initState,
                errors: {...initState.errors, signIn: action.payload.error},
            };

        case "SIGNUP_SUCCESS":
            return {
                ...initState,
                role: action.payload.role
            };

        case "SIGNIN_SUCCESS":
            return {
                ...initState,
                role: action.payload.role
            };

        case "SIGNOUT_SUCCESS":
            return initState;

        case "CLEAR_ERRORS":
            return {
                ...state,
                errors: {...state.errors, signUp: null, signIn: null},
            };

        default:
            return state;
    }
};

export default authReducer;
