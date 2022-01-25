const initState = {
    role: null
};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNIN_SUCCESS":
            return {
                ...state,
                role: action.role,

            };

        case "SIGNIN_ERROR":
            return {
                ...state,
                role: null
            };

        case "SIGNOUT_SUCCESS":
            return {
                ...state,
                role: null
            };

        default:
            return state;
    }
};

export default userReducer;
