import React, {useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputTextarea} from "primereact/inputtextarea";
import moment from "moment";
import {TeachingRoomService} from "../services/TeachingRoomService";

const Chat = props => {
    const {firebaseAuth, chat, roomID, getMyProfilePicture, getOtherProfilePicture} = props;
    const [message, setMessage] = useState('');

    const profilePictureBodyTemplate = rowData => {
        return <div>
            <Image
                src={rowData.uid === firebaseAuth.uid ? getMyProfilePicture() : getOtherProfilePicture()}
                alt="Profile Picture"
            />
        </div>
    }

    const messageContentBodyTemplate = rowData => {
        return <div>
            <p className={rowData.uid === firebaseAuth.uid ? "my-message-td-content" : "other-message-td-content"}>
                {
                    rowData.messageType === 'text'
                        ? rowData.messageContent
                        : <>
                            <i className="pi pi-file"/>
                            <a href={rowData.messageContent.url} download target="_blank">{rowData.messageContent.name}</a>
                        </>
                }
            </p>
        </div>
    }

    const timeBodyTemplate = rowData => {
        return <p className="time-td-content">
            {moment(rowData.time.toDate()).format('HH:mm')}
        </p>
    }

    return (
        <div className="chat-content">
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
                        field="messageContent"
                        body={messageContentBodyTemplate}
                        className="message-content-td"
                    />

                    <Column
                        field="time"
                        body={timeBodyTemplate}
                        className="time-td"
                    />
                </DataTable>
                <div className="send-message-div">
                    <div>
                        <InputTextarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ide írd az üzenetet..."
                        />
                    </div>
                    <div>
                        <Button label="Küldés"
                                onClick={() => {
                                    TeachingRoomService.sendMessage(roomID, firebaseAuth.uid, message, "text")
                                        .then(() => setMessage(''))
                                }}
                                disabled={message.length === 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}]),
)(Chat);