import {rrfProps as state} from "../config/firebaseConfig";

export const CreateLessonService = lesson => {
    const firestore = state.firebase.firestore;

    firestore()
        .collection("lessons")
        .doc()
        .set({
            ...lesson,
        })
        .catch(err => {
            return (err);
        });
    return null;
};