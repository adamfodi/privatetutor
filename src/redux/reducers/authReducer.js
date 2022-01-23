const initState = {
    authError: null
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNIN_SUCCESS":
            console.log("login success");
            return {
                ...state,
                authError: null
            };

        case "SIGNIN_ERROR":
            console.log("signin error");
            return {
                ...state,
                authError: "Sikertelen bejelentkezés!"
            };

        case "SIGNOUT_SUCCESS":
            console.log("signout success");
            return state;

        case "SIGNUP_SUCCESS":
            console.log("signup success");
            return {
                ...state,
                authError: null
            };

        case "SIGNUP_ERROR":
            console.log("Sikertelen regisztráció!");
            return {
                ...state,
                authError: action.err.message
            };

        default:
            return state;
    }
};

export default authReducer;
