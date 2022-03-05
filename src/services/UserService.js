import {getFirebase} from "react-redux-firebase";

export const UserService = {

    async updatePersonalData(uid, personalData) {

        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                personalData: personalData
            })
    },

    async updateProfessionalData(uid, professionalData) {

        await getFirebase()
            .firestore()
            .collection("users")
            .doc(uid)
            .update({
                professionalData: professionalData
            })
    },

}


