import React, {useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import {Dialog} from "primereact/dialog";
import {useLocation, useNavigate} from "react-router-dom";
import WaitingRoomDialog from "./dialogs/WaitingRoomDialog";
import {WebRTCFunctions} from "../functions/webRTCFunctions";
import placeholder from "../assets/img/profile-picture-placeholder.png";
import "../assets/css/teaching-room.css"
import Chat from "./Chat";
import {Button} from "primereact/button";
import {Image} from "primereact/image";
import {ProgressSpinner} from "primereact/progressspinner";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import Swal from "sweetalert2";
import {TeachingRoomService} from "../services/TeachingRoomService";
import {v4 as uuidv4} from "uuid";

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
    const [showLocalWebcam, setShowLocalWebcam] = useState(false);
    const [localWebcamLoading, setLocalWebcamLoading] = useState(false);
    const [remoteWebcamLoading, setRemoteWebcamLoading] = useState(false);
    const [file, setFile] = useState(null);
    const fileRef = useRef();
    const storage = getStorage();

    const remoteMediaStreamStatus = useRef("off");

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
        stopLocalMediaStream,
        createRoom,
        joinRoom,
        iceConnectionStateEventListener,
        tutorIceCandidateEventListener,
        studentIceCandidateEventListener,
        trackEventListener
    } = WebRTCFunctions(role, localStream, remoteStream, localVideoRef, remoteVideoRef, peerConnection,
        teachingRoomRef, tutorCandidatesCollectionRef, studentCandidatesCollectionRef, setConnectionState,
    );

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
        return otherUser && otherUser.profile.profilePictureUrl ? otherUser.profile.profilePictureUrl  : placeholder;
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

    const uploadButtonClick = (fileRef) => {
        fileRef.current.click();
    };

    const uploadChangeFile = (event, fileRef) => {
        if (event.target.value.length !== 0) {
            const file = event.target.files[0];
            fileRef.current.value = null;

            if (file.size <= 10000000) {
                setFile(file)
            } else {
                Swal.fire({
                    icon: "error",
                    title: "A kép mérete maximum 10 MB lehet!",
                    allowOutsideClick: false,
                });
            }
        }
    };

    const uploadFile = () => {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Feltöltés...",
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        const random = uuidv4().substring(0, 8);
        const storageRef = ref(storage, location.state.privateLesson.roomID + '/' + random + "-" + file.name);

        uploadBytes(storageRef, file)
            .then(() => {
                getDownloadURL(storageRef)
                    .then((url) => {
                        TeachingRoomService.sendMessage(
                            location.state.privateLesson.roomID,
                            firebaseAuth.uid,
                            {name: file.name, url: url},
                            "file"
                        )
                            .then(() => {
                                setFile(null);
                                Swal.fire({
                                    timer: 1500,
                                    icon: "success",
                                    title: "Sikeres feltöltés!",
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                })
                            })
                    })
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Hiba történt a file feltöltése során!",
                    allowOutsideClick: false,
                });
            })
    };

    console.log(remoteVideoRef.current)

    return (
        <div className="teaching-room-container">
            <div className="teaching-room-content">
                <div className="left-div">
                    <div className="my-cam-div">
                        {
                            showLocalWebcam
                                ? <div>
                                    {
                                        localWebcamLoading && <ProgressSpinner/>
                                    }
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        onPlay={() => setLocalWebcamLoading(false)}
                                    />
                                </div>
                                :
                                <Image
                                    src={getMyProfilePicture()}
                                    alt="Profile Picture"
                                />
                        }
                    </div>
                    <div>
                        {
                            !showWaitingRoomDialog &&
                            <Chat
                                chat={chat}
                                roomID={privateLesson.roomID}
                                getMyProfilePicture={getMyProfilePicture}
                                getOtherProfilePicture={getOtherProfilePicture}
                            />
                        }
                    </div>
                </div>
                <div className="right-div">
                    <div className="exit">
                        <Button label="Kilépés"
                                onClick={() => navigate("/private-lessons")}
                        />
                    </div>
                    <div className="other-cam-div">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            controls={connectionState === "connected"}
                            hidden={showWaitingRoomDialog || connectionState !== "connected" || !remoteStream.current.active}
                        />
                        {
                            !showWaitingRoomDialog && (connectionState !== "connected" || !remoteStream.current.active) &&
                            <Image
                                src={getOtherProfilePicture()}
                                alt="Profile Picture"
                            />
                        }
                    </div>
                    <div>
                        <div className="file-upload">
                            <div>
                                <p>File feltöltés</p>
                                <div>
                                    <Button type="button"
                                            label="Kiválasztás"
                                            className="p-button-primary"
                                            onClick={() => uploadButtonClick(fileRef)}
                                            disabled={file !== null}
                                    />
                                    <input type="file"
                                           id="file"
                                           ref={fileRef}
                                           style={{display: "none"}}
                                           onChange={event => uploadChangeFile(event, fileRef)}
                                    />
                                    <p>{file && file.name}</p>
                                </div>
                                <div>
                                    <Button type="button"
                                            label="Törlés"
                                            className="p-button-danger"
                                            onClick={() => setFile(null)}
                                            disabled={!file}
                                    />
                                    <Button type="button"
                                            label="Feltöltés"
                                            className="p-button-success"
                                            onClick={() => uploadFile()}
                                            disabled={!file}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*<Button*/}
                        {/*    label="kikapcs"*/}
                        {/*    onClick={() => stopLocalMediaStream(localStream)}*/}
                        {/*/>*/}
                        {/*<Button*/}
                        {/*    label="bekapcs"*/}
                        {/*    onClick={() => startWebcam(localStream, localVideoRef)}*/}
                        {/*/>*/}


                        {/*<div className="camera-button-div">*/}
                        {/*    <Button icon="pi pi-camera"*/}
                        {/*            iconPos="right"*/}
                        {/*            label={showLocalWebcam ? "Kamera kikapcsolása" : "Kamera bekapcsolása"}*/}
                        {/*            className={showLocalWebcam ? "p-button-danger" : "p-button-success"}*/}
                        {/*            onClick={() => {*/}
                        {/*                if (showLocalWebcam) {*/}
                        {/*                    setLocalWebcamLoading(false)*/}
                        {/*                    stopLocalMediaStream(localStream)*/}
                        {/*                        .then(() => setShowLocalWebcam(false))*/}
                        {/*                    console.log("finished stopping webcam")*/}
                        {/*                } else {*/}
                        {/*                    setShowLocalWebcam(true)*/}
                        {/*                    setLocalWebcamLoading(true)*/}
                        {/*                    startWebcam(localStream, localVideoRef)*/}
                        {/*                        .then(() => {*/}
                        {/*                            setShowLocalWebcam(true);*/}
                        {/*                            console.log("finished starting webcam")*/}
                        {/*                        })*/}
                        {/*                        .catch(() => setShowLocalWebcam(false))*/}
                        {/*                }*/}
                        {/*            }}*/}
                        {/*    />*/}
                        {/*</div>*/}
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
                    showWebcam={showLocalWebcam}
                    setShowWebcam={setShowLocalWebcam}
                    webcamLoading={localWebcamLoading}
                    setWebcamLoading={setLocalWebcamLoading}
                    roomCreated={roomCreated}
                    localStream={localStream}
                    localVideoRef={localVideoRef}
                    startWebcam={startWebcam}
                    stopLocalMediaStream={stopLocalMediaStream}
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