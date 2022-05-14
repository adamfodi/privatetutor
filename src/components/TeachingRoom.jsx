import React, {useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import {Dialog} from "primereact/dialog";
import {useLocation, useNavigate} from "react-router-dom";
import WaitingRoomDialog from "./dialogs/WaitingRoomDialog";
import placeholder from "../assets/img/profile-picture-placeholder.png";
import "../assets/css/teaching-room.css"
import Chat from "./Chat";
import {Button} from "primereact/button";
import {Image} from "primereact/image";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import Swal from "sweetalert2";
import {TeachingRoomService} from "../services/TeachingRoomService";
import {v4 as uuidv4} from "uuid";
import {WebRTCService} from "../services/WebRTCService";
import Countdown from "react-countdown";

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
    const [file, setFile] = useState(null);
    const [localMediaStreamOn, setLocalMediaStreamOn] = useState(false)
    const [remoteMediaStreamOn, setRemoteMediaStreamOn] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false);
    const [localMediaStreamType, setLocalMediaStreamType] = useState("camera");
    const fileRef = useRef();
    const storage = getStorage();

    const peerConnection = useRef(null);
    const localStream = useRef(new MediaStream());
    const remoteStream = useRef(new MediaStream());
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    const teachingRoomRef = useRef(getFirebase().firestore().collection('teachingRooms').doc(privateLesson.roomID));
    const tutorCandidatesCollectionRef = useRef(teachingRoomRef.current.collection('tutorCandidates'));
    const studentCandidatesCollectionRef = useRef(teachingRoomRef.current.collection('studentCandidates'));

    useEffect(() => {
        const _peerConnection = peerConnection;
        const _localStream = localStream;
        const _remoteStream = remoteStream;

        const unsubscribeTeachingRoom = teachingRoomRef.current.onSnapshot(async (snapshot) => {
            snapshot.data().offer ? setRoomCreated(true) : setRoomCreated(false);
            role === "student" && setRemoteMediaStreamOn(snapshot.data().mediaStream.tutorMediaStreamOn);
            role === "tutor" && setRemoteMediaStreamOn(snapshot.data().mediaStream.studentMediaStreamOn);
            setChat(snapshot.data().chat.sort(sortMessagesByDate));
        });

        return () => {
            if (_peerConnection.current) {
                WebRTCService.unSubscribe(role, _peerConnection, _localStream, _remoteStream)
                TeachingRoomService.resetTeachingRoom(privateLesson.roomID, tutorCandidatesCollectionRef, studentCandidatesCollectionRef)
                    .catch(() => {
                    })
            }
            unsubscribeTeachingRoom();
        }
    }, [privateLesson.roomID, role])

    const setMediaStream = (localMediaStreamOn) => {
        return {
            studentMediaStreamOn: role === "student" ? localMediaStreamOn : remoteMediaStreamOn,
            tutorMediaStreamOn: role === "tutor" ? localMediaStreamOn : remoteMediaStreamOn,
        }
    }

    const startLocalWebcam = () => {
        setButtonLoading(true)
        WebRTCService.startWebcam(peerConnection, localStream, localVideoRef)
            .then(() => {
                TeachingRoomService.setMediaStream(privateLesson.roomID, setMediaStream(true))
                    .then(() => {
                        setLocalMediaStreamOn(true);
                        setLocalMediaStreamType("camera")
                        setButtonLoading(false);
                    })
            })
    }

    const startLocalScreenShare = () => {
        setButtonLoading(true)
        WebRTCService.startScreenShare(peerConnection, localStream, localVideoRef, stopLocalMediaStreamBrowser)
            .then(() => {
                TeachingRoomService.setMediaStream(privateLesson.roomID, setMediaStream(true))
                    .then(() => {
                        setLocalMediaStreamOn(true);
                        setLocalMediaStreamType("screenshare")
                        setButtonLoading(false);
                    })
            })
    }

    const stopLocalMediaStream = () => {
        setButtonLoading(true)
        WebRTCService.stopMediaStream(peerConnection, localStream)
            .then(() => {
                TeachingRoomService.setMediaStream(privateLesson.roomID, setMediaStream(false))
                    .then(() => {
                        setLocalMediaStreamOn(false);
                        setLocalMediaStreamType(null);
                        setButtonLoading(false);
                    })
            })
    }

    const stopLocalMediaStreamBrowser = () => {
        setButtonLoading(true)
        TeachingRoomService.setMediaStream(privateLesson.roomID, setMediaStream(false))
            .then(() => {
                setLocalMediaStreamOn(false);
                setLocalMediaStreamType(null);
                setButtonLoading(false);
            })
    }

    const createRoom = async (webcamPlaying, waitingRoomLocalStream, waitingRoomLocalVideoRef) => {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Óra indítása...",
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        let _localMediaStreamOn = false;

        if (!webcamPlaying) {
            await WebRTCService.createDummyStream(localStream, localVideoRef);
        } else {
            localStream.current = waitingRoomLocalStream.current;
            localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
            _localMediaStreamOn = true;
        }

        WebRTCService.createRoom(peerConnection, localStream, remoteStream, remoteVideoRef, setConnectionState,
            tutorCandidatesCollectionRef, teachingRoomRef, studentCandidatesCollectionRef, privateLesson.roomID, navigate)
            .then(() => {
                TeachingRoomService.setMediaStream(privateLesson.roomID, setMediaStream(_localMediaStreamOn))
                    .then(() => {
                        setLocalMediaStreamOn(_localMediaStreamOn);
                        setShowWaitingRoomDialog(false);
                        Swal.fire({
                            timer: 1500,
                            icon: "success",
                            title: "Sikeres óra indítás!",
                            showConfirmButton: false,
                            allowOutsideClick: false,
                        })
                    })
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Hiba történt az óra indítása során!",
                    allowOutsideClick: false,
                });
            })
    }

    const joinRoom = async (webcamPlaying, waitingRoomLocalStream, waitingRoomLocalVideoRef) => {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Csatlakozás...",
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        let _localMediaStreamOn = false;

        if (!webcamPlaying) {
            await WebRTCService.createDummyStream(localStream, localVideoRef);
        } else {
            localStream.current = waitingRoomLocalStream.current;
            localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
            _localMediaStreamOn = true;
        }

        WebRTCService.joinRoom(peerConnection, localStream, remoteStream, remoteVideoRef, setConnectionState,
            tutorCandidatesCollectionRef, teachingRoomRef, studentCandidatesCollectionRef, privateLesson.roomID, navigate)
            .then(() => {
                TeachingRoomService.setMediaStream(privateLesson.roomID, setMediaStream(_localMediaStreamOn))
                    .then(() => {
                        setLocalMediaStreamOn(_localMediaStreamOn);
                        setShowWaitingRoomDialog(false);
                        Swal.fire({
                            timer: 1500,
                            icon: "success",
                            title: "Sikeres csatlakozás!",
                            showConfirmButton: false,
                            allowOutsideClick: false,
                        })
                    })
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Hiba történt a csatlakozás során!",
                    allowOutsideClick: false,
                });
            });
    }

    const getMyProfilePicture = () => {
        const url = profile.profile.profilePictureUrl;
        return url ? url : placeholder;
    }

    const getOtherProfilePicture = () => {
        const otherUser = users.filter(user => user.id === privateLesson[otherRole + "UID"])[0];
        return otherUser && otherUser.profile.profilePictureUrl ? otherUser.profile.profilePictureUrl : placeholder;
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
        const storageRef = ref(storage, privateLesson.roomID + '/' + random + "-" + file.name);

        uploadBytes(storageRef, file)
            .then(() => {
                getDownloadURL(storageRef)
                    .then((url) => {
                        TeachingRoomService.sendMessage(
                            privateLesson.roomID,
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

    return (
        <div className="teaching-room-container">
            <div
                className={!showWaitingRoomDialog ? "teaching-room-content" : "teaching-room-content-hidden"}
            >
                <div className="left-div">
                    <div className="my-cam-div">
                        <div className="media-div">
                            {
                                !localMediaStreamOn &&
                                <Image
                                    src={getMyProfilePicture()}
                                    alt="Profile Picture"
                                />
                            }
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                hidden={!localMediaStreamOn}
                            />
                        </div>
                        <div className="buttons-div">
                            {localMediaStreamOn &&
                                <Button
                                    label={localMediaStreamType === "camera" ? "Kamera kikapcsolása" : "Képernyőmegosztás leállítása"}
                                    className="p-button-danger"
                                    onClick={() => stopLocalMediaStream()}
                                    loading={buttonLoading}
                                />
                            }
                            {!localMediaStreamOn &&
                                <div className="on-buttons">
                                    <Button
                                        label="Kamera bekapcsolása"
                                        onClick={() => startLocalWebcam()}
                                        loading={buttonLoading}
                                    />
                                    <Button
                                        label="Képernyőmegosztás bekapcsolása"
                                        className="p-button-secondary"
                                        onClick={() => startLocalScreenShare()}
                                        loading={buttonLoading}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="chat-div">
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
                    <div className="clock-and-exit-div">
                        <Countdown
                            date={Date.now() + (privateLesson.dateTo - new Date())}
                            onComplete={() => navigate("/private-lessons")}
                        />
                        <Button label="Kilépés"
                                className="p-button-danger"
                                onClick={() => navigate("/private-lessons")}
                        />
                    </div>
                    <div className="other-cam-div">
                        {
                            !remoteMediaStreamOn &&
                            <Image
                                src={getOtherProfilePicture()}
                                alt="Profile Picture"
                            />
                        }
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            controls={connectionState === "connected"}
                            hidden={!remoteMediaStreamOn}
                        />
                    </div>
                    <div className="file-upload-div">
                        <p>Fájl megosztás</p>
                        <div>
                            <div className="select-div">
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
                            {file &&
                                <div className="action-div">
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
                            }

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
                    roomCreated={roomCreated}
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