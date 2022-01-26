const initState = {
    signInError: null,
    signUpError: null,
    signUpSuccess: null
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNIN_SUCCESS":
            return initState;

        case "SIGNIN_ERROR":
            return {
                ...initState,
                signInError: action.err.message,
            };

        case "SIGNOUT_SUCCESS":
            return initState;

        case "SIGNUP_SUCCESS":
            return {
                ...initState,
                signUpSuccess: true
            };

        case "SIGNUP_ERROR":
            return {
                ...initState,
                signUpError: action.err.message,
            };

        case "CLEAR_AUTH":
            return initState;

        default:
            return state;
    }
};

export default authReducer;
