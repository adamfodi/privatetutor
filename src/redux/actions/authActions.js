import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {getFirebase} from "react-redux-firebase";
import {createEmptyTimetable} from "../../util/CreateEmptyTimetable";

export const signUp = (newUser) => {
    return (dispatch) => {
        createUserWithEmailAndPassword(getAuth(), newUser.email, newUser.password)
            .then((userCredential) => {
                getFirebase().firestore().collection("users").doc(userCredential.user.uid).set({
                    profile: {
                        personalData: {
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            email: newUser.email,
                            birthday: newUser.birthday,
                            gender: newUser.gender
                        },
                        profilePictureUrl: null,
                        feedback: null
                    },
                    student: {
                        privateLessons: null,
                        tests: null
                    },
                    tutor: {
                        advertisement: {
                            educationLevel: null,
                            introduction: null,
                            subjects: [],
                            timetable: createEmptyTimetable(),
                            active: false
                        },
                        privateLessons: null,
                        tests: null
                    }
                })
                    .then(() => {
                        dispatch({
                            type: "SIGNUP_SUCCESS", payload: {
                                loggedIn: true, displayName: newUser.lastName + ' ' + newUser.firstName
                            }
                        });
                    })
                    .catch((error) => {
                        dispatch({
                            type: "SIGNUP_ERROR", payload: {
                                error: error.message
                            }
                        });
                    })
            })
    }
};

export const signIn = (credentials) => {
    return (dispatch) => {
        getFirebase()
            .auth()
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .then((userCredential) => {
                getFirebase().firestore().collection("users").doc(userCredential.user.uid).get()
                    .then(snapShot => {
                        dispatch({
                            type: "SIGNIN_SUCCESS", payload: {
                                loggedIn: true, displayName: snapShot.data().lastName + ' ' + snapShot.data().firstName
                            }
                        });
                    })
            })
            .catch((error) => {
                dispatch({
                    type: "SIGNIN_ERROR", payload: {
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
                dispatch({type: "SIGNOUT_SUCCESS"});
            });
    };
};

export const clearErrors = () => {
    return (dispatch) => {
        dispatch({type: "CLEAR_ERRORS"});
    };
};

export const updateDisplayName = (displayName) => {
    return (dispatch) => {
        dispatch({
            type: "UPDATE_DISPLAYNAME", payload: displayName
        });
    };
};
