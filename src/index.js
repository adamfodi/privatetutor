import React from 'react'
import {Provider} from 'react-redux'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {ReactReduxFirebaseProvider} from 'react-redux-firebase'
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import {rrfProps, store} from "./config/firebaseConfig";

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
