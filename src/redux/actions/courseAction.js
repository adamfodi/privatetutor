import {rrfProps as state} from "../../config/firebaseConfig";

export const createCourse = course => {
    return (dispatch) => {

        const firestore = state.firebase.firestore;
        firestore()
            .collection("courses")
            .doc()
            .set({
                ...course,
            })
            .then(() => {
                dispatch({ type: "COURSE_CREATION_SUCCESS" });
            })
            .catch(err => {
                console.log(err.message)
                dispatch({ type: "COURSE_CREATION_ERROR" }, err);
            });
        return null;
    };
};

export const clearCourses = () => {
    return (dispatch) => {
        dispatch({type: "CLEAR_COURSES"});
    };
};
