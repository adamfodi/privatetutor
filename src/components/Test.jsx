import {useCallback, useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {InputText} from "primereact/inputtext";
import {compose} from "redux";
import {connect} from "react-redux";
import Webcam from "react-webcam";

const Test = (props) => {
    // const configuration = {
    //     iceServers: [
    //         {
    //             urls: [
    //                 'stun:stun1.l.google.com:19302',
    //                 'stun:stun2.l.google.com:19302'
    //             ],
    //         },
    //     ],
    //     iceCandidatePoolSize: 10,
    // };
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

    console.log(remoteStream.current)

    let roomId = null;

    const [webcamButtonDisabled, setWebcamButtonDisabled] = useState(false);
    const [callButtonDisabled, setCallButtonDisabled] = useState(false);
    const [answerButtonDisabled, setAnswerButtonDisabled] = useState(false);
    const [hangupButtonDisabled, setHangupButtonDisabled] = useState(false);
    const [callInputText, setCallInputText] = useState('');

    const teachingRoomRef = useRef(getFirebase().firestore().collection('teachingRooms').doc('asd123asd'));
    const tutorCandidatesCollectionRef = useRef(teachingRoomRef.current.collection('tutorCandidates'));
    const studentCandidatesCollectionRef = useRef(teachingRoomRef.current.collection('studentCandidates'));

    const createOffer = async () => {
        // Code for creating a room below
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        console.log('Created offer:', offer);

        const roomWithOffer = {
            'offer': {
                type: offer.type,
                sdp: offer.sdp,
            },
        };
        await teachingRoomRef.current.update(roomWithOffer);
        roomId = teachingRoomRef.current.id;
        console.log(`New room created with SDP offer. Room ID: ${teachingRoomRef.current.id}`);
        // Code for creating a room above
    }

    const createAnswer = async (roomSnapshot) => {
        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log('Got offer:', offer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        console.log('Created answer:', answer);
        await peerConnection.current.setLocalDescription(answer);

        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
        };
        await teachingRoomRef.current.update(roomWithAnswer);
        // Code for creating SDP answer above
    }

    const tutorIceCandidateEventListener = useCallback((event) => {
        event.candidate && tutorCandidatesCollectionRef.current.add(event.candidate.toJSON())
    }, [])

    const studentIceCandidateEventListener = useCallback((event) => {
        event.candidate && studentCandidatesCollectionRef.current.add(event.candidate.toJSON())
    }, [])

    const trackEventListener = useCallback((event) => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
            console.log('Add a track to the remoteStream:', track);
            remoteStream.current.addTrack(track);
        });
    }, [])

    const teachingRoomSnapshot = () => {
        teachingRoomRef.current.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (!peerConnection.current.currentRemoteDescription && data && data.answer) {
                console.log('Got remote description: ', data.answer);
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                await peerConnection.current.setRemoteDescription(rtcSessionDescription)
                    .catch(() => {
                        console.log("Connection closed!")
                    })
            }
        });
    }

    const studentCandidatesSnapshot = () => {
        studentCandidatesCollectionRef.current.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                        .catch(() => {
                            console.log("Connection closed!")
                        })
                }
            });
        });
    }

    const tutorCandidatesSnapshot = () => {
        teachingRoomRef.current.collection('tutorCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                        .catch(() => {
                            console.log("Connection closed!")
                        })
                }
            });
        });
    }

    console.log(peerConnection.current)

    useEffect(() => {
        const _teachingRoomRef = teachingRoomRef.current;
        const _studentCandidatesCollectionRef = studentCandidatesCollectionRef.current;
        const _tutorCandidatesCollectionRef = tutorCandidatesCollectionRef.current;

        return () => {
            console.log("Bye component")
            console.log("UNSUBSCRIBE")

            peerConnection.current.removeEventListener('icecandidate', studentIceCandidateEventListener);
            peerConnection.current.removeEventListener('icecandidate', tutorIceCandidateEventListener);
            peerConnection.current.removeEventListener('track', trackEventListener);
            _teachingRoomRef.onSnapshot(() => {})
            _studentCandidatesCollectionRef.onSnapshot(() => {});
            _tutorCandidatesCollectionRef.onSnapshot(() => {});
        }
    },[studentIceCandidateEventListener, trackEventListener, tutorIceCandidateEventListener])

    const startWebcam = async () => {
        console.log("Webcam starting...")
        await navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(mediaStream => {
            localStream.current = mediaStream;
            localVideoRef.current.srcObject = mediaStream;
        });
        remoteVideoRef.current.srcObject = remoteStream.current;
    }

    // ONLY TEACHER CAN CREATE THE ROOM
    const createRoom = async () => {
        console.log('Create PeerConnection with configuration: ', configuration);
        peerConnection.current = new RTCPeerConnection(configuration);

        localStream.current.getTracks().forEach(track => {
            console.log(track)
            peerConnection.current.addTrack(track, localStream.current);
        });

        peerConnection.current.addEventListener('icecandidate', tutorIceCandidateEventListener);
        await createOffer();
        peerConnection.current.addEventListener('track', trackEventListener);
        teachingRoomSnapshot();
        studentCandidatesSnapshot();
    }

    const joinRoomById = async () => {
        const roomSnapshot = await teachingRoomRef.current.get();
        console.log('Got room:', roomSnapshot.exists);

        if (roomSnapshot.exists) {
            console.log('Create PeerConnection with configuration: ', configuration);
            peerConnection.current = new RTCPeerConnection(configuration);

            localStream.current.getTracks().forEach(track => {
                console.log(track)
                peerConnection.current.addTrack(track, localStream.current);
            });

            peerConnection.current.addEventListener('icecandidate', studentIceCandidateEventListener);
            peerConnection.current.addEventListener('track', trackEventListener);
            await createAnswer(roomSnapshot);
            teachingRoomSnapshot();
            tutorCandidatesSnapshot();
        }
    }

    const hangUp = () => {
        // profilkepet berakok helyere ha nincsen
        localStream.current && localStream.current.getTracks().forEach(track => {
            track.stop();
        });

        remoteStream.current && remoteStream.current.getTracks().forEach(track => {
            track.stop();
        });

        peerConnection.current && peerConnection.current.close();

        //make room empty in db
    }

    return (
        <div style={{marginLeft: "10px"}}>
            <h1>Webcam TEST</h1>
            <div style={{display: "flex"}}>
                <div>
                    <h3>Local Stream</h3>
                    <video ref={localVideoRef} autoPlay playsInline muted={false} width={"50%"} height={"50%"}/>
                </div>
                <div>
                    <h3>Remote Stream</h3>
                    <video ref={remoteVideoRef} autoPlay playsInline/>
                </div>
            </div>

            <h2>1. Star webcam</h2>
            <button disabled={webcamButtonDisabled} onClick={() => startWebcam()}>Start webcam</button>

            <h2>2. Create a new Call</h2>
            <button disabled={callButtonDisabled} onClick={() => createRoom()}>Create Room (offer)</button>

            <h2>3. Join a Call</h2>
            <p>Answer the call from a different browser window or device</p>
            <InputText value={callInputText}
                       onChange={(e) => setCallInputText(e.target.value)}
            />
            <button disabled={answerButtonDisabled} onClick={() => joinRoomById(callInputText)}>Answer</button>

            <h2>4. Hangup</h2>
            <button disabled={hangupButtonDisabled} onClick={() => hangUp()}>Hangup</button>

        </div>

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
)(Test);