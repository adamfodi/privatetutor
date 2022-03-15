import {getFirebase} from "react-redux-firebase";

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

    async updateTutorAdvertisement(uid, advertisement) {

        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                'tutor.advertisement': advertisement
            })
    },

}


