import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {applyMiddleware, createStore} from 'redux'
import {createFirestoreInstance} from 'redux-firestore'
import rootReducer from "../redux/reducers/rootReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

const firebaseConfig = {
    apiKey: "AIzaSyClHuL2aknLUGzHOLokYKNiUwYIKAcw5kk",
    authDomain: "privatetutor-1417d.firebaseapp.com",
    projectId: "privatetutor-1417d",
    storageBucket: "privatetutor-1417d.appspot.com",
    messagingSenderId: "222055152392",
    appId: "1:222055152392:web:70ac3ec2128beb5f054abd",
    measurementId: "G-G72QX89H46"
};

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
    attachAuthIsReady: true
};

// Initialize firebase instance
firebase.initializeApp(firebaseConfig)
// Initialize Cloud Firestore through Firebase
firebase.firestore();

// Create store with reducers and initial state
const initialState = {};
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
        applyMiddleware(thunk),
    ),
);

// react-redux-firebase props
const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // NEEDED FOR FIRESTORE REDUCER!
};

export {store, rrfProps};