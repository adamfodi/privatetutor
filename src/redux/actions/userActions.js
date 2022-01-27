export const switchRole = role => {
    return (dispatch) => {
        dispatch({type: "SWITCH_" + role.toUpperCase()});
    };
};