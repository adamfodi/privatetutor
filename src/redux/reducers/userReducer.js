const initState = {
    displayName: null,
    email: null
};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNIN_SUCCESS":
            return {
                ...state,
                displayName: action.displayName,
                email: action.email
            };

        case "SIGNIN_ERROR":
            return initState;

        case "SIGNOUT_SUCCESS":
            return initState;

        default:
            return state;
    }
};

export default userReducer;
