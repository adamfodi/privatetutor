import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyClHuL2aknLUGzHOLokYKNiUwYIKAcw5kk",
    authDomain: "privatetutor-1417d.firebaseapp.com",
    projectId: "privatetutor-1417d",
    storageBucket: "privatetutor-1417d.appspot.com",
    messagingSenderId: "222055152392",
    appId: "1:222055152392:web:70ac3ec2128beb5f054abd",
    measurementId: "G-G72QX89H46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);