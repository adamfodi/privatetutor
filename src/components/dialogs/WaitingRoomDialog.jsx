import React, {useRef, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import placeholder from "../../assets/img/profile-picture-placeholder.png";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import "../../assets/css/dialogs/waiting-room-dialog.css"
import {InputTextarea} from "primereact/inputtextarea";
import moment from "moment";
import {TeachingRoomService} from "../../services/TeachingRoomService";
import {startWebcam} from "../../functions/WebRTCFunctions";
import {ProgressSpinner} from "primereact/progressspinner";

const WaitingRoomDialog = props => {
    const {
        chat,
        roomID,
        otherUID,
        setShowWaitingRoomDialog,
        firebaseAuth,
        users,
        role,
        profile,
        peerConnection,
        localStream,
        remoteStream,
        localVideoRef,
        remoteVideoRef,
    } = props;
    const [message, setMessage] = useState('');
    const [showWebCam, setShowWebCam] = useState(false);
    const [showWebCamLoading, setShowWebCamLoading] = useState(true);
    const waitingRoomLocalStream = useRef(new MediaStream());
    const waitingRoomLocalVideoRef = useRef();

    const getMyProfilePicture = () => {
        const url = profile.profile.profilePictureUrl;
        return url ? url : placeholder;
    }

    const getOtherProfilePicture = () => {
        const otherUser = users.filter(user => user.id === otherUID)[0];
        return otherUser ? otherUser.profile.profilePictureUrl : placeholder;
    }

    const profilePictureBodyTemplate = rowData => {
        return <div>
            <Image
                src={rowData.uid === firebaseAuth.uid ? getMyProfilePicture() : getOtherProfilePicture()}
                alt="Profile Picture"
            />
        </div>
    }

    const contentBodyTemplate = rowData => {
        return <div>
            <p className={rowData.uid === firebaseAuth.uid ? "my-message-td-content" : "other-message-td-content"}>
                {rowData.content}
            </p>
        </div>
    }

    const timeBodyTemplate = rowData => {
        return <p className="time-td-content">
            {moment(rowData.time.toDate()).format('HH:mm')}
        </p>
    }


    return (
        <div className="waiting-room-content">
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
                                src={profile.profile.profilePictureUrl ? profile.profile.profilePictureUrl : placeholder}
                                alt="Profile Picture"
                            />
                    }
                </div>
                <div className="camera-button-div">
                    <Button icon="pi pi-camera"
                            iconPos="right"
                            label={showWebCam ? "Kamera kikapcsolása" : "Kamera bekapcsolása"}
                            className={showWebCam ? "p-button-danger" : "p-button-primary"}
                            onClick={() => {
                                if (showWebCam){
                                    waitingRoomLocalStream.current = new MediaStream();
                                    waitingRoomLocalVideoRef.current = null;
                                    setShowWebCam(false)
                                }else{
                                    setShowWebCam(true)
                                    startWebcam(waitingRoomLocalStream, remoteStream, waitingRoomLocalVideoRef, remoteVideoRef)
                                        .catch(() => setShowWebCam(false))
                                }
                            }}
                    />
                </div>
                <div className="action-button-div">
                    {
                        role === 'tutor'
                            ? <Button
                                label="Óra indítása"
                                onClick={() => {
                                    setShowWaitingRoomDialog(false)
                                }}
                                className="p-button-success"
                            />
                            : <Button
                                label="Csatlakozás"
                                onClick={() => {
                                    setShowWaitingRoomDialog(false)
                                }}
                                className="p-button-success"
                            />
                    }
                </div>
            </div>
            <div>
                <DataTable
                    value={chat}
                    responsiveLayout="scroll"
                    emptyMessage=" "
                >
                    <Column
                        field="profilePicture"
                        body={profilePictureBodyTemplate}
                        className="profile-picture-td"
                    />

                    <Column
                        field="content"
                        body={contentBodyTemplate}
                        className="content-td"
                    />

                    <Column
                        field="time"
                        body={timeBodyTemplate}
                        className="time-td"
                    />
                </DataTable>
                <div className="send-message-div">
                    <InputTextarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ide írd az üzenetet..."
                    />
                    <Button label="Küldés"
                            onClick={() => {
                                TeachingRoomService.sendMessage(roomID, message, firebaseAuth.uid)
                                    .then(() => setMessage(''))
                            }}
                            disabled={message.length === 0}
                    />
                </div>

            </div>
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
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}]),
)(WaitingRoomDialog);