import React, {useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import { doc } from "firebase/firestore";
import {compose} from "redux";
import {connect} from "react-redux";
import {Dialog} from "primereact/dialog";
import {useLocation, useNavigate} from "react-router-dom";
import WaitingRoomDialog from "./dialogs/WaitingRoomDialog";
import {WebRTCFunctions} from "../functions/WebRTCFunctions";
import placeholder from "../assets/img/profile-picture-placeholder.png";
import "../assets/css/teaching-room.css"
import Chat from "./Chat";
import {Button} from "primereact/button";
import {rrfProps as state} from "../config/firebaseConfig";
import {Image} from "primereact/image";

const TeachingRoom = (props) => {
    const {firebaseAuth, users, profile, role} = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [showWaitingRoomDialog, setShowWaitingRoomDialog] = useState(true);
    const [chat, setChat] = useState([]);
    const [roomCreated, setRoomCreated] = useState(false);
    const [privateLesson] = useState(location.state.privateLesson);
    const [otherRole] = useState(location.state.otherRole);
    const [connectionState, setConnectionState] = useState(null);
    const componentLeft = useRef(false);

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

    const teachingRoomRef = useRef(getFirebase().firestore().collection('teachingRooms').doc(location.state.privateLesson.roomID));
    const tutorCandidatesCollectionRef = useRef(teachingRoomRef.current.collection('tutorCandidates'));
    const studentCandidatesCollectionRef = useRef(teachingRoomRef.current.collection('studentCandidates'));

    const {
        startWebcam,
        startScreenShare,
        stopMediaStream,
        createRoom,
        joinRoom,
        tutorIceCandidateEventListener,
        studentIceCandidateEventListener,
        trackEventListener
    } = WebRTCFunctions(localStream, remoteStream, localVideoRef, remoteVideoRef, peerConnection,
        configuration, teachingRoomRef, tutorCandidatesCollectionRef, studentCandidatesCollectionRef, setConnectionState);

    useEffect(() => {
        console.log("Component mounted!")
        teachingRoomRef.current.onSnapshot(async (snapshot) => {
            snapshot.data().offer && setRoomCreated(true);
            setChat(snapshot.data().chat.sort(sortMessagesByDate));
        });
        return () => {
            console.log("Component unmounting...!")
            componentLeft.current = true;
        }
    }, [])

    useEffect(() => {
        const _peerConnection = peerConnection.current;
        const _localStream = localStream.current;
        const _remoteStream = remoteStream.current;
        const _teachingRoomRef = teachingRoomRef.current;
        const _studentCandidatesCollectionRef = studentCandidatesCollectionRef.current;
        const _tutorCandidatesCollectionRef = tutorCandidatesCollectionRef.current;

        return () => {
            if (_peerConnection && componentLeft.current) {
                // console.log("UNSUBSCRIBE")

                if (role === 'tutor') {
                    _peerConnection.removeEventListener('icecandidate', tutorIceCandidateEventListener);
                    _studentCandidatesCollectionRef.onSnapshot(() => {
                    });
                }

                if (role === 'student') {
                    _peerConnection.removeEventListener('icecandidate', studentIceCandidateEventListener);
                    _tutorCandidatesCollectionRef.onSnapshot(() => {
                    });
                }

                _peerConnection.removeEventListener('track', trackEventListener);
                _teachingRoomRef.onSnapshot(() => {
                })

                _localStream && _localStream.getTracks().forEach(track => {
                    track.stop();
                });

                _remoteStream && _remoteStream.getTracks().forEach(track => {
                    track.stop();
                });

                _peerConnection.close();
            }
        }
    }, [peerConnection, localStream, remoteStream, teachingRoomRef,
        studentCandidatesCollectionRef, tutorCandidatesCollectionRef, studentIceCandidateEventListener,
        tutorIceCandidateEventListener, trackEventListener, role, componentLeft])


    const getMyProfilePicture = () => {
        const url = profile.profile.profilePictureUrl;
        return url ? url : placeholder;
    }

    const getOtherProfilePicture = () => {
        const otherUser = users.filter(user => user.id === privateLesson[otherRole + "UID"])[0];
        return otherUser ? otherUser.profile.profilePictureUrl : placeholder;
    }

    const sortMessagesByDate = (a, b) => {
        if (a.time < b.time) {
            return 1;
        }
        if (a.time > b.time) {
            return -1;
        }
        return 0;
    }

    return (
        <div className="teaching-room-container">
            <div className="teaching-room-content">
                <div className="left-div">
                    <div className="my-cam-div">
                        <video ref={localVideoRef} autoPlay playsInline/>
                        {/*<Image*/}
                        {/*    src={getMyProfilePicture()}*/}
                        {/*    alt="Profile Picture"*/}
                        {/*/>*/}
                    </div>
                    <div>
                        <Chat
                            chat={chat}
                            roomID={privateLesson.roomID}
                            getMyProfilePicture={getMyProfilePicture}
                            getOtherProfilePicture={getOtherProfilePicture}
                        />
                    </div>
                </div>
                <div className="right-div">
                    <div className="other-cam-div">
                        <video ref={remoteVideoRef}
                               autoPlay
                               playsInline
                               hidden={connectionState !== "connected"}
                            />
                        {
                            connectionState !== "connected" &&
                            <Image
                                src={getOtherProfilePicture()}
                                alt="Profile Picture"
                            />
                        }
                    </div>
                    <div className="clock-div">
                        <div>
                            <Button label="Kilépés"
                                    onClick={() => navigate("/private-lessons")}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Várószoba"
                    visible={showWaitingRoomDialog}
                    position={"center"}
                    modal
                    onHide={() => navigate("/private-lessons")}
                    draggable={false}
                    resizable={false}
                    className="waiting-room-dialog"
            >
                <WaitingRoomDialog
                    chat={chat}
                    roomID={privateLesson.roomID}
                    setShowWaitingRoomDialog={setShowWaitingRoomDialog}
                    roomCreated={roomCreated}
                    localStream={localStream}
                    localVideoRef={localVideoRef}
                    startWebcam={startWebcam}
                    stopMediaStream={stopMediaStream}
                    createRoom={createRoom}
                    joinRoom={joinRoom}
                    getMyProfilePicture={getMyProfilePicture}
                    getOtherProfilePicture={getOtherProfilePicture}
                />
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        users: state.firestore.ordered.users,
        profile: state.firebase.profile,
        role: state.role,
    };
};

export default compose(
    firestoreConnect([{collection: "users"}]),
    connect(mapStateToProps)
)(TeachingRoom);