const initState = {
    error: null,
    loggedIn: false,
    displayName: null
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNUP_SUCCESS":
            return action.payload;

        case "SIGNUP_ERROR":
            return {
                ...initState,
                error: action.payload.error,
            };

        case "SIGNIN_SUCCESS":
            return action.payload;

        case "SIGNIN_ERROR":
            return {
                ...initState,
                error: action.payload.error,
            };

        case "SIGNOUT_SUCCESS":
            return initState;

        case "CLEAR_AUTH":
            return initState;

        default:
            return state;
    }
};

export default authReducer;
