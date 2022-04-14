import React, {useRef, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import "../../assets/css/dialogs/waiting-room-dialog.css"
import {ProgressSpinner} from "primereact/progressspinner";
import Chat from "../Chat";

const WaitingRoomDialog = props => {
    const {
        firebaseAuth,
        role,
        chat,
        roomID,
        setShowWaitingRoomDialog,
        localStream,
        localVideoRef,
        startWebcam,
        stopMediaStream,
        createRoom,
        joinRoom,
        getMyProfilePicture,
        getOtherProfilePicture
    } = props;
    const [showWebCam, setShowWebCam] = useState(false);
    const [showWebCamLoading, setShowWebCamLoading] = useState(true);
    const waitingRoomLocalStream = useRef(new MediaStream());
    const waitingRoomLocalVideoRef = useRef();

    return (
        <div className="waiting-room-content">
            <div>
                <div>
                    <div className="camera-div">
                        {
                            showWebCam
                                ? <div>
                                    {
                                        showWebCamLoading && <ProgressSpinner/>
                                    }
                                    <video ref={waitingRoomLocalVideoRef}
                                           autoPlay
                                           playsInline
                                           onPlay={() => setShowWebCamLoading(false)}
                                    />
                                </div>
                                :
                                <Image
                                    src={getMyProfilePicture()}
                                    alt="Profile Picture"
                                />
                        }
                    </div>
                    <div className="camera-button-div">
                        <Button icon="pi pi-camera"
                                iconPos="right"
                                label={showWebCam ? "Kamera kikapcsolása" : "Kamera bekapcsolása"}
                                className={showWebCam ? "p-button-danger" : "p-button-success"}
                                onClick={() => {
                                    if (showWebCam) {
                                        setShowWebCamLoading(true)
                                        stopMediaStream(waitingRoomLocalStream);
                                        setShowWebCam(false);
                                    } else {
                                        setShowWebCam(true)
                                        startWebcam(waitingRoomLocalStream, waitingRoomLocalVideoRef)
                                            .catch(() => setShowWebCam(false))
                                    }
                                }}
                        />
                    </div>
                </div>
                <div className="action-button-div">
                    {
                        role === 'tutor'
                            ? <Button
                                label="Óra indítása"
                                onClick={() => {
                                    setShowWaitingRoomDialog(false)
                                    localStream.current = waitingRoomLocalStream.current;
                                    localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
                                    createRoom();
                                }}
                            />
                            : <Button
                                label="Csatlakozás"
                                onClick={() => {
                                    setShowWaitingRoomDialog(false)
                                    localStream.current = waitingRoomLocalStream.current;
                                    localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
                                    joinRoom();
                                }}
                                tooltip="blabla"
                            />
                    }
                </div>
            </div>
            <div>
                <Chat
                    chat={chat}
                    roomID={roomID}
                    getMyProfilePicture={getMyProfilePicture}
                    getOtherProfilePicture={getOtherProfilePicture}
                />
            </div>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        role: state.role,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}]),
)(WaitingRoomDialog);