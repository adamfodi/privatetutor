import {rrfProps as state} from "../../config/firebaseConfig";
import moment from "moment";

export const signIn = credentials => {
    return (dispatch) => {
        const firebase = state.firebase;

        firebase
            .auth()
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .then(() => {
                dispatch({type: "SIGNIN_SUCCESS"});
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
        const firestore = state.firebase.firestore;

        firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(resp => {
                return firestore()
                    .collection("users")
                    .doc(resp.user.uid)
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
