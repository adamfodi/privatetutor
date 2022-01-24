const initState = {
    signInError: null,
    signUpError: null,
    role: null
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNIN_SUCCESS":
            return {
                ...initState,
                role: action.role
            };

        case "SIGNIN_ERROR":
            return {
                ...state,
                signInError: "Sikertelen bejelentkezés!"
            };

        case "SIGNOUT_SUCCESS":
            return initState;

        case "SIGNUP_SUCCESS":
            return initState;

        case "SIGNUP_ERROR":
            return {
                ...initState,
                signUpError: "Sikertelen regisztráció!"
            };

        default:
            return state;
    }
};

export default authReducer;
