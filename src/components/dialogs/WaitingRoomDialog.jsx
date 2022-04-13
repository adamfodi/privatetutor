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

const WaitingRoomDialog = props => {
    const {chat, roomID, otherUID, setShowWaitingRoomDialog, firebaseAuth, users, role} = props;
    const [message, setMessage] = useState('');

    const getProfilePicture = () => {
        const otherUser = users.filter(user => user.id === otherUID)[0];
        if (otherUser) {
            return otherUser.profile.profilePictureUrl;
        } else {
            return placeholder;
        }
    }

    const getName = () => {
        const otherUser = users.filter(user => user.id === otherUID)[0];
        return otherUser ? otherUser.profile.personalData.fullName : '';
    }

    console.log(otherUID)

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
                        src={getProfilePicture()}
                        alt="Profile Picture"
                    />
                </div>
                <p>{getName()}</p>
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
                    emptyMessage="Nincs még üzenet"
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
        users: state.firestore.ordered.users,
        role: state.role
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}]),
)(WaitingRoomDialog);