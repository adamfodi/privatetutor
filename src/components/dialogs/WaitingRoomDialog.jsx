import React, {useState} from "react";
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
import {Skeleton} from "primereact/skeleton";

const WaitingRoomDialog = props => {
    const {chat, role, roomID, otherUserProfile, setShowWaitingRoomDialog, firebaseAuth} = props;
    const [message, setMessage] = useState('');

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
                <div>
                    <Image
                        src={otherUserProfile && otherUserProfile.profile.profilePictureUrl ? otherUserProfile.profile.profilePictureUrl : placeholder}
                        alt="Profile Picture"
                    />
                </div>
                <p>{otherUserProfile && otherUserProfile.profile.profilePictureUrl && otherUserProfile.profile.personalData.fullName}</p>
                <div>
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
                >
                    <Column
                        field="content"
                        body={contentBodyTemplate}
                        className="content-td"
                    />

                    <Column
                        field="time"
                        body={timeBodyTemplate}
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
        privateLessons: state.firestore.ordered.privateLessons,
        teachingRooms: state.firestore.ordered.teachingRooms
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "privateLessons"}]),
    firestoreConnect([{collection: "teachingRooms"}])
)(WaitingRoomDialog);