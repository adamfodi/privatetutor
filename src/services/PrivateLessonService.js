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

    async deletePrivateLesson(id) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("privateLessons")
            .doc(id)
            .delete()
    }

}


