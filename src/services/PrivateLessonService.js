import {rrfProps as state} from "../config/firebaseConfig";


export const PrivateLessonService = {

    async createPrivateLesson(privateLesson) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("privateLessons")
            .doc()
            .set(privateLesson)
    },

    async modifyPrivateLessonDate(privateLessonID, newDateFrom, newDateTo) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("privateLessons")
            .doc(privateLessonID)
            .update({
                dateFrom: newDateFrom,
                dateTo: newDateTo
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


