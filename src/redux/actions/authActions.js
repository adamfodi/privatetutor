import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {getFirebase} from "react-redux-firebase";
import {createEmptyTimetable} from "../../util/CreateEmptyTimetable";

export const signUp = (newUser) => {
    return (dispatch) => {
        createUserWithEmailAndPassword(getAuth(), newUser.email, newUser.password)
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
                            },
                            profilePictureUrl: null,
                            feedback: null
                        },
                        tutor: {
                            advertisement: {
                                introduction: null,
                                subjects: [],
                                timetable: createEmptyTimetable(),
                                hourlyRate: null,
                                active: false
                            },
                        }
                    })
                    .then(() => {
                        dispatch({
                            type: "SIGNUP_SUCCESS",
                            payload: {
                                role: newUser.role,
                            }
                        });
                    })
            })
            .catch((error) => {
                dispatch({
                    type: "SIGNUP_ERROR",
                    payload: {
                        error: error.message
                    }
                });
            })
    }
};

export const signIn = (credentials) => {
    return (dispatch) => {
        getFirebase()
            .auth()
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .then(() => {
                dispatch({
                    type: "SIGNIN_SUCCESS",
                    payload: {
                        role: credentials.role,
                    }
                });
            })
            .catch((error) => {
                dispatch({
                    type: "SIGNIN_ERROR",
                    payload: {
                        error: error.message
                    }
                });
            })
    };
};

export const signOut = () => {
    return (dispatch) => {
        getFirebase()
            .auth()
            .signOut()
            .then(() => {
                dispatch({
                    type: "SIGNOUT_SUCCESS"
                });
            });
    };
};

export const clearErrors = () => {
    return (dispatch) => {
        dispatch({
            type: "CLEAR_ERRORS"
        });
    };
};
