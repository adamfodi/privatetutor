import {combineReducers} from "redux";
import {firestoreReducer} from "redux-firestore";
import {firebaseReducer} from "react-redux-firebase";
import roleReducer from "./roleReducer";

const rootReducer = combineReducers({
    role: roleReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});

export default rootReducer;