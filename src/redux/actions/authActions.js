import {rrfProps as state} from "../../config/firebaseConfig";

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
        const firestore = state.firestore;


        firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(resp => {
                return firestore
                    .collection("users")
                    .doc(resp.user.uid)
                    .set({
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        initials: newUser.firstName[0] + newUser.lastName[0]
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
