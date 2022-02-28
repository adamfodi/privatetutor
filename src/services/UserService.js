import {getFirebase} from "react-redux-firebase";

export const UserService = {

    async updateProfile(uid, profile) {

        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update(profile)
    },

}


