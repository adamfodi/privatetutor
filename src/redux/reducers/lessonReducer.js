const initState = {
    creationError: null,
    cCreationSuccess: null
};

const lessonReducer = (state = initState, action) => {
    switch (action.type) {
        case "LESSON_CREATION_SUCCESS":
            return {
                ...state,
                creationSuccess: true,
            };
        case "LESSON_CREATION_ERROR":
            return {
                ...state,
                creationError: action.err.message,
            };
        default:
            return state;
    }
};

export default lessonReducer;
