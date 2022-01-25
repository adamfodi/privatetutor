import authReducer from "./authReducer";
import {combineReducers} from "redux";
import {firestoreReducer} from "redux-firestore";
import {firebaseReducer} from "react-redux-firebase";
import userReducer from "./userReducer";
import lessonReducer from "./lessonReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    lessons: lessonReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});

export default rootReducer;