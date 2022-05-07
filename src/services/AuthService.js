import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {getFirebase} from "react-redux-firebase";
import {createEmptyTimetable} from "../util/CreateEmptyTimetable";

export const AuthService = {

    async signUp(newUser) {
        await createUserWithEmailAndPassword(getAuth(), newUser.email, newUser.password)
            .then((userCredential) => {
                getFirebase()
                    .firestore()
                    .collection("users")
                    .doc(userCredential.user.uid)
                    .set({
                        profile: {
                            personalData: {
                                firstName: newUser.firstName,
                                lastName: newUser.lastName,
                                fullName: newUser.lastName + ' ' + newUser.firstName,
                                email: newUser.email,
                                birthday: newUser.birthday,
                                gender: newUser.gender,
                                phoneNumber: null,
                                city: ""
                            },
                            profilePictureUrl: null,
                            feedback: {
                                list: [],
                                sum: "-"
                            }
                        },
                        messages: {
                            incoming: [],
                            outgoing: []
                        },
                        tutor: {
                            advertisement: {
                                introduction: null,
                                subjects: [],
                                timetable: createEmptyTimetable(),
                                hourlyRate: null,
                                active: false
                            }
                        }
                    })
            })
    },

    async signIn(credentials) {
        await getFirebase()
            .auth()
            .signInWithEmailAndPassword(credentials.email, credentials.password)
    },

    async signOut() {
        await getFirebase()
            .auth()
            .signOut()
    }
}
