import {firebaseConfig, rrfProps as state} from "../../config/firebaseConfig";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import moment from "moment";

export const signIn = credentials => {
    return (dispatch) => {
        const firebase = state.firebase;

        firebase
            .auth()
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .then(() => {
                onAuthStateChanged(getAuth(), (user) => {
                    if (user) {
                        firebase.firestore().collection("users").doc(user.uid).get()
                            .then(function (doc) {
                                dispatch({
                                    type: "SIGNIN_SUCCESS",
                                    role: credentials.role,
                                    displayName: doc.data().lastName + ' ' + doc.data().firstName
                                });
                            })
                    }
                })
            })
            .catch(err => {
                dispatch({type: "SIGNIN_ERROR", err});
            });
    };
};

export const signOut = () => {
    return (dispatch) => {
        const firebase = state.firebase;

        firebase
            .auth()
            .signOut()
            .then(() => {
                dispatch({type: "SIGNOUT_SUCCESS"});
            });
    };
};

export const signUp = newUser => {
    return (dispatch) => {
        const firebase = state.firebase;
        const tempFirebase = firebase.initializeApp(firebaseConfig, "secondary");

        tempFirebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(userCredentials => {
                return firebase.firestore()
                    .collection("users")
                    .doc(userCredentials.user.uid)
                    .set({
                        firstName: newUser.firstname,
                        lastName: newUser.lastname,
                        birthday: moment(newUser.birthday).format('YYYY.MM.DD'),
                        gender: newUser.gender
                    });
            })
            .then(() => {
                dispatch({type: "SIGNUP_SUCCESS"});
            })
            .catch(err => {
                dispatch({type: "SIGNUP_ERROR", err});
            });
    };
};

export const clearAuth = () => {
    return (dispatch) => {
        dispatch({type: "CLEAR_AUTH"});
    };
};
