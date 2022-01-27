const initState = {
    creationError: null,
    creationSuccess: null,
    modificationError: null,
    modificationSuccess: null,
};

const courseReducer = (state = initState, action) => {
    switch (action.type) {
        case "COURSE_CREATION_SUCCESS":
            return {
                ...initState,
                creationSuccess: true,
            };

        case "COURSE_CREATION_ERROR":
            return {
                ...initState,
                creationError: action.err.message,
            };

        case "COURSE_MODIFICATION_SUCCESS":
            return {
                ...initState,
                modificationSuccess: true,
            };

        case "COURSE_MODIFICATION_ERROR":
            return {
                ...initState,
                modificationError: action.err.message,
            };


        case "CLEAR_COURSES":
            return initState;

        default:
            return state;
    }
};

export default courseReducer;
