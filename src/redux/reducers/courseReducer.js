const initState = {
    creationError: null,
    creationSuccess: false,
    modificationError: null,
    modificationSuccess: false,
    updateError: null,
    updateSuccess: false,
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

        case "COURSE_APPLICANTS_MODIFICATION_SUCCESS":
            return {
                ...initState,
                modificationSuccess: true,
            };

        case "COURSE_APPLICANTS_MODIFICATION_ERROR":
            return {
                ...initState,
                modificationError: action.err.message,
            };

        case "COURSE_UPDATE_SUCCESS":
            return {
                ...initState,
                updateSuccess: true,
            };

        case "COURSE_UPDATE_ERROR":
            return {
                ...initState,
                updateError: action.err.message,
            };

        case "CLEAR_COURSES":
            return initState;

        default:
            return state;
    }
};

export default courseReducer;
