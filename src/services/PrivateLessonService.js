import {rrfProps as state} from "../config/firebaseConfig";

export const PrivateLessonService = {

    async createPrivateLesson(privateLesson) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("privateLessons")
            .doc()
            .set(privateLesson)
    },

    async modifyPrivateLessonStatus(privateLessonID, status) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("privateLessons")
            .doc(privateLessonID)
            .update({
                status: status
            })
    },

    async modifyPrivateLessonFeedback(privateLessonID, role) {
        const firestore = state.firebase.firestore;
        await firestore()
            .collection("privateLessons")
            .doc(privateLessonID)
            .update(
                role === "tutor"
                    ? {tutorFeedback: true}
                    : {studentFeedback: true}
            )
    },

    async deletePrivateLesson(id) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("privateLessons")
            .doc(id)
            .delete()
    }

}


