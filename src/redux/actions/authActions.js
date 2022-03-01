import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {getFirebase} from "react-redux-firebase";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {createPlaceholderFile} from "../../util/FileUtil";

export const signUp = (newUser) => {
    return (dispatch) => {
        createUserWithEmailAndPassword(getAuth(), newUser.email, newUser.password)
            .then((userCredential) => {
                getFirebase().firestore().collection("users").doc(userCredential.user.uid).set({
                    personalData: {
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        birthday: newUser.birthday,
                        gender: newUser.gender
                    },
                    professionalData: {}
                })
                    .then(() => {
                        const storage = getStorage();
                        const storageRef = ref(storage, 'profilePictures/' + userCredential.user.uid);
                        createPlaceholderFile(userCredential.user.uid).then((file) => {
                            const metadata = {
                                customMetadata: {
                                    'placeholder': 'true'
                                }
                            };
                            uploadBytes(storageRef, file, metadata)
                                .then(() => {
                                    dispatch(
                                        {
                                            type: "SIGNUP_SUCCESS",
                                            payload: {
                                                loggedIn: true,
                                                displayName: newUser.lastName + ' ' + newUser.firstName
                                            }
                                        });
                                })
                        })
                    })
            })
            .catch((error) => {
                dispatch(
                    {
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
            .then((userCredential) => {
                getFirebase().firestore().collection("users").doc(userCredential.user.uid).get()
                    .then(snapShot => {
                        dispatch(
                            {
                                type: "SIGNIN_SUCCESS",
                                payload: {
                                    loggedIn: true,
                                    displayName: snapShot.data().lastName + ' ' + snapShot.data().firstName
                                }
                            });
                    })
            })
            .catch((error) => {
                dispatch(
                    {
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
        dispatch(
            {
                type: "UPDATE_DISPLAYNAME",
                payload: displayName
            }
        );
    };
};
