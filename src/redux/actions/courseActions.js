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

export const updateCourse = (courseID,course) => {
    return (dispatch) => {

        const firestore = state.firebase.firestore;
        firestore()
            .collection("courses")
            .doc(courseID)
            .update({
                ...course
            })
            .then(() => {
                dispatch({ type: "COURSE_UPDATE_SUCCESS" });
            })
            .catch(err => {
                console.log(err.message)
                dispatch({ type: "COURSE_UPDATE_ERROR" }, err);
            });
        return null;
    };
};

export const modifyCourseApplicants = (courseID,newApplicants) => {
    return (dispatch) => {

        const firestore = state.firebase.firestore;
        firestore()
            .collection("courses")
            .doc(courseID)
            .update({
                applicants: newApplicants
            })
            .then(() => {
                dispatch({ type: "COURSE_APPLICANTS_MODIFICATION_SUCCESS" });
            })
            .catch(err => {
                console.log(err.message)
                dispatch({ type: "COURSE_APPLICANTS_MODIFICATION_ERROR" }, err);
            });
        return null;
    };
};

export const showCourseDialog = (show) => {
    return (dispatch) => {
        if (show){
            dispatch({type: "SHOW_COURSE_DIALOG_TRUE"});
        }
        dispatch({type: "SHOW_COURSE_DIALOG_FALSE"});
    };
};

export const clearCourses = () => {
    return (dispatch) => {
        dispatch({type: "CLEAR_COURSES"});
    };
};
