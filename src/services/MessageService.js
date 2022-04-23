import {rrfProps as state} from "../config/firebaseConfig";
import {arrayRemove, arrayUnion} from "firebase/firestore";


export const MessageService = {

    async sendMessage(message) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("users")
            .doc(message.fromUID)
            .update({
                'messages.outgoing': arrayUnion(message)
            })

        await firestore()
            .collection("users")
            .doc(message.toUID)
            .update({
                'messages.incoming': arrayUnion({...message, read: false})
            })
    },

    async deleteIncomingMessage(uid, message) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("users")
            .doc(uid)
            .update({
                'messages.incoming': arrayRemove(message)
            })
    },

    async deleteOutgoingMessage(uid, message) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("users")
            .doc(uid)
            .update({
                'messages.outgoing': arrayRemove(message)
            })
    },

    async setIncomingMessageRead(uid, message) {
        const firestore = state.firebase.firestore;

        await firestore()
            .collection("users")
            .doc(uid)
            .update({
                'messages.incoming': arrayRemove(message)
            })

        await firestore()
            .collection("users")
            .doc(uid)
            .update({
                'messages.incoming': arrayUnion({...message, read: true})
            })
    },
}