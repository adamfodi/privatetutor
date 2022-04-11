const initState = null;

const roleReducer = (state = initState, action) => {
    switch (action.type) {
        case "SET_ROLE":
            return action.payload;
        case "CLEAR_ROLE":
            return initState;
        default:
            return state;
    }
};

export default roleReducer;
