const initState = {
    role: null,
    displayName: null
};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case "SIGNIN_SUCCESS":
            return {
                ...state,
                role: action.role,
                displayName: action.displayName
            };

        case "SIGNIN_ERROR":
            return initState;

        case "SIGNOUT_SUCCESS":
            return initState;

        case "SWITCH_STUDENT":
            return {
                ...state,
                role: 'tutor',
            };

        case "SWITCH_TUTOR":
            return {
                ...state,
                role: 'student',
            };

        default:
            return state;
    }
};

export default userReducer;
