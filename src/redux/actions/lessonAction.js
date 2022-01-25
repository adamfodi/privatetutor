import {rrfProps as state} from "../../config/firebaseConfig";

export const createLesson = lesson => {
    return (dispatch) => {

        const firestore = state.firebase.firestore;
        firestore()
            .collection("lessons")
            .doc()
            .set({
                ...lesson,
            })
            .then(() => {
                dispatch({ type: "LESSON_CREATION_SUCCESS" });
            })
            .catch(err => {
                console.log(err.message)
                dispatch({ type: "LESSON_CREATION_ERROR" }, err);
            });
        return null;
    };
};
