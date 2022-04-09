import {rrfProps as state} from "../config/firebaseConfig";


export const PrivateLessonService = {

    async createPrivateLesson(privateLesson) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("privateLessons")
            .doc()
            .set(privateLesson)
    },

    async updateCourse(courseID, course) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("courses")
            .doc(courseID)
            .update(course)
    },

    async modifyCourseApplicants(courseID, newApplicants) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("courses")
            .doc(courseID)
            .update({
                applicants: newApplicants
            })
    },

    async deleteCourses(courses) {
        const firestore = state.firebase.firestore;
        let batch = firestore().batch();

        await courses.forEach(course => {
            let ref = firestore().collection("courses").doc(course.id);
            batch.delete(ref)
        });

        return batch.commit();
    },

}


