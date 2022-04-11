export const setRole = role => {
    console.log(role)
    return (dispatch) => {
        dispatch({
            type: "SET_ROLE",
            payload: role
        })
    }
};

export const clearRole = () => {
    return (dispatch) => {
        dispatch({
            type: "CLEAR_ROLE",
        })
    }
};