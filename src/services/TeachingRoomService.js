import {getFirebase} from "react-redux-firebase";


export const TeachingRoomService = {

    async createRoom(roomID) {
        await getFirebase()
            .firestore()
            .collection("teachingRooms")
            .doc(roomID)
            .set({
                chat: []
            })
    },

    async deleteRoom(roomID) {
        await getFirebase()
            .firestore()
            .collection("teachingRooms")
            .doc(roomID)
            .delete()
    },

    async updateOnlineStatus(id, role, value) {
        await getFirebase()
            .firestore()
            .collection("privateLessons")
            .doc(id)
            .update({
                [`${role}IsOnline`]: value
            })
    },

    async doLogin(id, localRole) {
        console.log("doLogin")
        await getFirebase()
            .firestore()
            .collection("privateLessons")
            .doc(id)
            .update({
                [`WebRTC.${localRole}`]: null
            })
    },

    async sendOffer(id, remoteRole, localRole, offer) {
        console.log("sendOffer")
        await getFirebase()
            .firestore()
            .collection("privateLessons")
            .doc(id)
            .update({
                [`WebRTC.${remoteRole}`]: {
                    type: 'offer',
                    from: localRole,
                    offer: JSON.stringify(offer)
                }
            })
    },

    async sendAnswer(id, remoteRole, localRole, answer) {
        console.log("sendAnswer")
        await getFirebase()
            .firestore()
            .collection("privateLessons")
            .doc(id)
            .update({
                [`WebRTC.${remoteRole}`]: {
                    type: 'answer',
                    from: localRole,
                    answer: JSON.stringify(answer)
                }
            })
    },

    async sendCandidate(id, remoteRole, localRole, candidate) {
        console.log("sendCandidate")
        await getFirebase()
            .firestore()
            .collection("privateLessons")
            .doc(id)
            .update({
                [`WebRTC.${remoteRole}`]: {
                    type: 'candidate',
                    from: localRole,
                    candidate: JSON.stringify(candidate)
                }
            })
    },


}