import {getFirebase} from "react-redux-firebase";
import {rrfProps as state} from "../config/firebaseConfig";
import {arrayUnion, deleteField} from "firebase/firestore";


export const TeachingRoomService = {

    async createRoom(roomID) {
        await getFirebase()
            .firestore()
            .collection("teachingRooms")
            .doc(roomID)
            .set({
                chat: [],
                mediaStream: {
                    studentMediaStreamOn: false,
                    tutorMediaStreamOn: false
                },
            })
    },

    async deleteRoom(roomID) {
        await getFirebase()
            .firestore()
            .collection("teachingRooms")
            .doc(roomID)
            .delete()
    },

    async sendMessage(roomID, uid, messageContent, messageType) {
        const firestore = state.firebase.firestore;
        const message = {
            messageType: messageType,
            messageContent: messageContent,
            time: new Date(),
            uid: uid
        }

        await firestore()
            .collection("teachingRooms")
            .doc(roomID)
            .update({
                chat: arrayUnion(message)
            })
    },

    async setMediaStream(roomID, mediaStream) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("teachingRooms")
            .doc(roomID)
            .update({
                mediaStream: mediaStream
            })
    },

    resetTeachingRoom(roomID) {
        const firestore = state.firebase.firestore;

         firestore()
            .collection("teachingRooms")
            .doc(roomID)
            .update({
                mediaStream: {
                    studentMediaStreamOn: false,
                    tutorMediaStreamOn: false
                },
                offer: deleteField(),
                answer: deleteField()
            })
    },
}