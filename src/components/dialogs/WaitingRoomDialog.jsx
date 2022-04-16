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
    const [showWebCam, setShowWebCam] = useState(false);
    const [webCamLoading, setWebCamLoading] = useState(true);
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
                                        webCamLoading && <ProgressSpinner/>
                                    }
                                    <video
                                        ref={waitingRoomLocalVideoRef}
                                        autoPlay
                                        playsInline
                                        controls={!webCamLoading}
                                        onPlay={() => setWebCamLoading(false)}
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
                                        setWebCamLoading(true)
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
                {
                    role === 'tutor'
                        ? <p className="info">Az óra csak akkor indítható el, ha a kamera már be van kapcsolva!
                            (ideiglenes megoldás)</p>
                        :
                        <p className="info">Az órához csak akkor lehet csatlakozni, ha a kamera már be van kapcsolva és,
                            ha az oktató már
                            elindította az órát! (ideiglenes megoldás)</p>
                }
                <div className="action-button-div">
                    {
                        role === 'tutor'
                            ? <Button
                                label="Óra indítása"
                                onClick={() => {
                                    localStream.current = waitingRoomLocalStream.current;
                                    localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
                                    createRoom();
                                    setShowWaitingRoomDialog(false)
                                }}
                                disabled={webCamLoading}
                            />
                            : <Button
                                label="Csatlakozás"
                                onClick={() => {
                                    localStream.current = waitingRoomLocalStream.current;
                                    localVideoRef.current.srcObject = waitingRoomLocalVideoRef.current.srcObject;
                                    joinRoom();
                                    setShowWaitingRoomDialog(false)
                                }}
                                disabled={webCamLoading || !roomCreated}
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