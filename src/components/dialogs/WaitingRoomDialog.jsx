import React, {useRef, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import "../../assets/css/dialogs/waiting-room-dialog.css"
import {ProgressSpinner} from "primereact/progressspinner";
import Chat from "../Chat";
import {WebRTCService} from "../../services/WebRTCService";

const WaitingRoomDialog = (props) => {
    const {
        role,
        chat,
        roomID,
        roomCreated,
        createRoom,
        joinRoom,
        getMyProfilePicture,
        getOtherProfilePicture
    } = props;

    const waitingRoomLocalStream = useRef(new MediaStream());
    const waitingRoomLocalVideoRef = useRef();
    const [webcamPlaying, setWebcamPlaying] = useState(false)
    const [webcamLoading, setWebcamLoading,] = useState(false);

    return (
        <div className="waiting-room-content">
            <div>
                <div>
                    <div className="camera-div">
                        {
                            !webcamPlaying && !webcamLoading &&
                            <Image
                                src={getMyProfilePicture()}
                                alt="Profile Picture"
                            />
                        }

                        {
                            !webcamPlaying && webcamLoading &&
                            <ProgressSpinner/>
                        }
                        <video
                            ref={waitingRoomLocalVideoRef}
                            autoPlay
                            playsInline
                            muted
                            hidden={!webcamPlaying || webcamLoading}
                        />
                    </div>
                    <div className="camera-button-div">
                        <Button icon="pi pi-camera"
                                iconPos="right"
                                label={webcamPlaying ? "Kamera kikapcsolása" : "Kamera bekapcsolása"}
                                className={webcamPlaying ? "p-button-danger" : "p-button-success"}
                                onClick={() => {
                                    if (webcamPlaying) {
                                        setWebcamLoading(true)
                                        WebRTCService.stopLocalMediaStream(null, waitingRoomLocalStream, waitingRoomLocalVideoRef)
                                            .then(() => {
                                                setWebcamLoading(false)
                                                setWebcamPlaying(false)
                                            })
                                            .catch(() => {
                                                setWebcamLoading(false)
                                                setWebcamPlaying(false)
                                            })

                                    } else {
                                        setWebcamLoading(true)
                                        WebRTCService.startWebcam(null, waitingRoomLocalStream, waitingRoomLocalVideoRef)
                                            .then(() => {
                                                setWebcamLoading(false)
                                                setWebcamPlaying(true)
                                            })
                                            .catch(() => {
                                                setWebcamLoading(false)
                                                setWebcamPlaying(false)
                                            })
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
                        role === "tutor" &&
                        <Button
                            label="Óra indítása"
                            onClick={() => createRoom(webcamPlaying, waitingRoomLocalStream, waitingRoomLocalVideoRef)}
                        />
                    }
                    {
                        role === "student" &&
                        <Button
                            label="Csatlakozás"
                            onClick={() => joinRoom(webcamPlaying, waitingRoomLocalStream, waitingRoomLocalVideoRef)}
                            disabled={!roomCreated}
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