import React, {useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
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
        // iceServers: [
        //     {
        //         urls: "turn:turn.anyfirewall.com:443?transport=tcp",
        //         username: "webrtc",
        //         credential: "webrtc"
        //     },
        // ],
        iceServers: [
            {
                urls: ["stun:eu-turn6.xirsys.com"]
            },
            {
                username: "ojgPiT2ZDqKqfLFj_0cEhlasdndv4c0ifDO_M3XM7w6AKbaOhEcgfjNbbuceZ7FRAAAAAGJaPzlpZm9kYW0=",
                credential: "abec16e4-bd39-11ec-8666-0242ac140004",
                urls: [
                    "turn:eu-turn6.xirsys.com:80?transport=udp",
                    "turn:eu-turn6.xirsys.com:3478?transport=udp",
                    "turn:eu-turn6.xirsys.com:80?transport=tcp",
                    "turn:eu-turn6.xirsys.com:3478?transport=tcp",
                    "turns:eu-turn6.xirsys.com:443?transport=tcp",
                    "turns:eu-turn6.xirsys.com:5349?transport=tcp"
                ]
            }],
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
        iceConnectionStateEventListener,
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

                _peerConnection.removeEventListener('track', iceConnectionStateEventListener);
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
        tutorIceCandidateEventListener, iceConnectionStateEventListener, trackEventListener, role, componentLeft])


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
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            controls
                        />
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
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            controls={connectionState === "connected"}
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