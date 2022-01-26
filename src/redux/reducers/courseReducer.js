const initState = {
    creationError: null,
    creationSuccess: null
};

const courseReducer = (state = initState, action) => {
    switch (action.type) {
        case "COURSE_CREATION_SUCCESS":
            return {
                ...state,
                creationSuccess: true,
            };

        case "COURSE_CREATION_ERROR":
            return {
                ...state,
                creationError: action.err.message,
            };

        case "CLEAR_COURSES":
            return initState;

        default:
            return state;
    }
};

export default courseReducer;
