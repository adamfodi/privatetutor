import React, {useRef, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import "../../assets/css/dialogs/waiting-room-dialog.css"
import {ProgressSpinner} from "primereact/progressspinner";
import Chat from "../Chat";

const WaitingRoomDialog = props => {
    const {
        role,
        chat,
        roomID,
        setShowWaitingRoomDialog,
        showWebcam,
        setShowWebcam,
        webcamLoading,
        setWebcamLoading,
        roomCreated,
        localStream,
        localVideoRef,
        startWebcam,
        stopMediaStream,
        createRoom,
        joinRoom,
        getMyProfilePicture,
        getOtherProfilePicture
    } = props;
    const waitingRoomLocalStream = useRef(new MediaStream());
    const waitingRoomLocalVideoRef = useRef();

    return (
        <div className="waiting-room-content">
            <div>
                <div>
                    <div className="camera-div">
                        {
                            showWebcam
                                ? <div>
                                    {
                                        webcamLoading && <ProgressSpinner/>
                                    }
                                    <video
                                        ref={waitingRoomLocalVideoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        onPlay={() => setWebcamLoading(false)}
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
                                label={showWebcam ? "Kamera kikapcsolása" : "Kamera bekapcsolása"}
                                className={showWebcam ? "p-button-danger" : "p-button-success"}
                                onClick={() => {
                                    if (showWebcam) {
                                        setWebcamLoading(false)
                                        stopMediaStream(waitingRoomLocalStream);
                                        setShowWebcam(false);
                                    } else {
                                        setShowWebcam(true)
                                        setWebcamLoading(true)
                                        startWebcam(waitingRoomLocalStream, waitingRoomLocalVideoRef)
                                            .catch(() => setShowWebcam(false))
                                    }
                                }}
                        />
                    </div>
                </div>
                {
                    role === 'student' &&
                        <p className="info">
                            Az órához csak akkor lehet csatlakozni, ha az oktató azt már elindította!
                        </p>
                }
                <div className="action-button-div">
                    {
                        role === 'tutor'
                            ? <Button
                                label="Óra indítása"
                                onClick={() => {
                                    if (showWebcam){
                                        localStream.current = waitingRoomLocalStream.current;
                                        localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
                                    }
                                    createRoom();
                                    setShowWaitingRoomDialog(false)
                                }}
                                disabled={webcamLoading || !showWebcam}
                            />
                            : <Button
                                label="Csatlakozás"
                                onClick={() => {
                                    if (showWebcam){
                                        localStream.current = waitingRoomLocalStream.current;
                                        localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
                                    }
                                    joinRoom();
                                    setShowWaitingRoomDialog(false)
                                }}
                                disabled={!roomCreated || webcamLoading}
                            />
                    }
                </div>
            </div>
            <div>
                <div>
                    <Chat
                        chat={chat}
                        roomID={roomID}
                        getMyProfilePicture={getMyProfilePicture}
                        getOtherProfilePicture={getOtherProfilePicture}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        role: state.role,
    };
};

export default compose(connect(mapStateToProps))(WaitingRoomDialog);