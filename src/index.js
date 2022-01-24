import React from 'react'
import {Provider} from 'react-redux'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {ReactReduxFirebaseProvider} from 'react-redux-firebase'
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import {persistor, rrfProps, store} from "./config/firebaseConfig";
import {PersistGate} from "redux-persist/integration/react";

ReactDOM.render(
    <React.Fragment>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ReactReduxFirebaseProvider {...rrfProps}>
                    <App/>
                </ReactReduxFirebaseProvider>
            </PersistGate>
        </Provider>
    </React.Fragment>,
    document.getElementById('root')
);
