import {getFirebase} from "react-redux-firebase";
import {arrayUnion} from "firebase/firestore";

export const UserService = {

    async updatePersonalData(uid, personalData) {
        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                'profile.personalData': personalData
            })
    },

    async updateProfilePictureUrl(uid, profilePictureUrl) {
        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                'profile.profilePictureUrl': profilePictureUrl
            })
    },

    async updateTutorAd(uid, advertisement) {

        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                'tutor.advertisement': advertisement
            })
    },

    async addFeedback(uid, feedback) {
        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                'profile.feedback.list': arrayUnion(feedback)
            })
            .then(async () => {
                const collectionRef = getFirebase().firestore().collection('users').doc(uid)
                const user = await collectionRef.get();

                let sum = 0;
                user.data().profile.feedback.list.forEach(feedback => {
                    sum += feedback.rating;
                })

                sum = (sum / user.data().profile.feedback.list.length).toFixed(1)

                await this.updateFeedbackSum(uid, sum);

            })
    },

    async updateFeedbackSum(uid, sum) {
        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                'profile.feedback.sum': sum
            })
    },

}


