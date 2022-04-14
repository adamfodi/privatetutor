import {useCallback, useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {InputText} from "primereact/inputtext";
import {compose} from "redux";
import {connect} from "react-redux";
import Webcam from "react-webcam";

const TutorWebRTC = (props) => {
    const configuration = {
        iceServers: [
            {
                urls: "turn:turn.anyfirewall.com:443?transport=tcp",
                username: "webrtc",
                credential: "webrtc"
            },
        ],
        iceCandidatePoolSize: 10,
    };

    const peerConnection = useRef(null);
    const localStream = useRef(new MediaStream());
    const remoteStream = useRef(new MediaStream());
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();


    return (
        <></>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        teachingRooms: state.firestore.ordered.teachingRooms
    };
};

export default compose(
    firestoreConnect([{collection: "teachingRooms"}]),
    connect(mapStateToProps)
)(TutorWebRTC);