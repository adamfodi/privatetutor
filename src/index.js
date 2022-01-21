import React from 'react'
import {Provider} from 'react-redux'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {applyMiddleware, compose, createStore} from 'redux'
import {getFirebase, ReactReduxFirebaseProvider} from 'react-redux-firebase'
import {createFirestoreInstance, getFirestore} from 'redux-firestore' // <- needed if using
import firebaseConfig from "./config/firebaseConfig";
import rootReducer from "./redux/reducers/rootReducer";
import * as ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {composeWithDevTools} from "redux-devtools-extension";
import "./index.css";
import thunk from "redux-thunk";


// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
    attachAuthIsReady: true
};

// Initialize firebase and firestore instances
firebase.initializeApp(firebaseConfig);
firebase.firestore();

const initialState = {};

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
        applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore}))
    )
);

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    firestore: createFirestoreInstance
}


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <App/>
            </ReactReduxFirebaseProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
