import React, {useCallback, useEffect, useRef, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {TeachingRoomService} from "../services/TeachingRoomService";
import {Button} from "primereact/button";
import {
    addCandidate,
    createAnswer,
    createOffer,
    listenToConnectionEvents,
    startCall
} from "../services/WebRTCFunctions";

const TeachingRoom = props => {
    const {auth, privateLessons} = props;
    const localRole = privateLessons[0].tutor === auth.uid ? 'tutor' : 'student';
    const remoteRole = privateLessons[0].tutor !== auth.uid ? 'tutor' : 'student';
    const [state, setState] = useState({
            connectedUser: null,
            localStream: null,
            localConnection: null

        }
    );
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();


    useEffect(() => {
        console.log("ONLINE STATUS USEEFFECT")
        if (auth.uid === 'PFuZ7ugJstMPAFTpy7GDSNWuBYE2') {
            TeachingRoomService.updateOnlineStatus('U6yzPD8HqSyNC979jfyC', 'student', true)
                .catch((error) => console.log(error))
        } else {
            TeachingRoomService.updateOnlineStatus('U6yzPD8HqSyNC979jfyC', 'tutor', true)
                .catch((error) => console.log(error))
        }

        return () => {
            console.log("BYE COMPONENT")
            TeachingRoomService.doLogin('U6yzPD8HqSyNC979jfyC', localRole)
            if (auth.uid === 'PFuZ7ugJstMPAFTpy7GDSNWuBYE2') {
                TeachingRoomService.updateOnlineStatus('U6yzPD8HqSyNC979jfyC', 'student', false)
                    .catch((error) => console.log(error))
            } else {
                TeachingRoomService.updateOnlineStatus('U6yzPD8HqSyNC979jfyC', 'tutor', false)
                    .catch((error) => console.log(error))
            }
        };
    }, [auth.uid])

    const setLocalStream = useCallback(
        async () => {
            return await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
        },
        [],
    );

    useEffect(() => {
        setLocalStream().then((mediaStream => {
            setState((prevState) => ({
                ...prevState, localStream: mediaStream
            }))
            localVideoRef.current.srcObject = mediaStream

            let localConnection = new RTCPeerConnection({
                iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
            })

            mediaStream.getTracks().forEach((track) => {
                localConnection.addTrack(track, mediaStream)
            })

            setState((prevState) => ({
                ...prevState, localConnection: localConnection
            }))

        }))

    }, [setLocalStream])

    useEffect(() => {
        console.log("UPDATE USE EFFECT")

        if (privateLessons[0]['WebRTC'][localRole] && privateLessons[0]['WebRTC'][localRole]['type']) {
            const myWebRTC = privateLessons[0]['WebRTC'][localRole];

            switch (myWebRTC.type) {
                case 'offer':
                    listenToConnectionEvents(state.localConnection, 'U6yzPD8HqSyNC979jfyC', remoteRole, localRole, remoteVideoRef)

                    createAnswer(state.localConnection, state.localStream, remoteRole, localRole, myWebRTC)
                    break
                case 'answer':
                    startCall(state.localConnection, myWebRTC)
                    break
                case 'candidate':
                    console.log(state)
                    addCandidate(state.localConnection, myWebRTC)
                    break
                default:
                    break
            }
        }


    }, [localRole, privateLessons, remoteRole, state])


    const callRemote = (() => {
        listenToConnectionEvents(state.localConnection, 'U6yzPD8HqSyNC979jfyC', remoteRole, localRole, remoteVideoRef)
        // setState((prevState) => ({
        //     ...prevState,
        //     localConnection: {
        //         ...prevState.localConnection, onicecandidate: {
        //         }
        //     }
        // }))
        createOffer(state.localConnection, state.localStream, remoteRole, localRole)
    })


    return (
        <div style={{display: 'flex'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h1>{localRole}</h1>
                <video ref={localVideoRef} autoPlay playsInline/>
                <Button label="Call Remote"
                        onClick={() => callRemote()}
                />

                <Button label="Do Login"
                        onClick={() => TeachingRoomService.doLogin('U6yzPD8HqSyNC979jfyC', localRole)}
                />
            </div>
            <div>
                <h2>{remoteRole}</h2>
                <video ref={remoteVideoRef} autoPlay playsInline/>
            </div>


        </div>
    )
}


const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        privateLessons: state.firestore.ordered.privateLessons
    };
};

export default compose(
    firestoreConnect([{collection: "privateLessons"}]),
    connect(mapStateToProps)
)(TeachingRoom);