import React, {useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import {Dialog} from "primereact/dialog";
import {useLocation, useNavigate} from "react-router-dom";
import WaitingRoomDialog from "./dialogs/WaitingRoomDialog";

const TeachingRoom = (props) => {
    const {firebaseAuth, users} = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [showWaitingRoomDialog, setShowWaitingRoomDialog] = useState(true);
    const [chat, setChat] = useState([]);
    const [privateLesson] = useState(location.state.privateLesson);
    const [otherRole] = useState(location.state.otherRole);
    const teachingRoomRef = useRef(getFirebase().firestore().collection('teachingRooms').doc(location.state.privateLesson.roomID));

    const sortMessagesByDate = (a, b) => {
        if (a.time < b.time) {
            return 1;
        }
        if (a.time > b.time) {
            return -1;
        }
        return 0;
    }

    useEffect(() => {
        const _teachingRoomRef = teachingRoomRef.current;

        _teachingRoomRef.onSnapshot(async (snapshot) => {
            setChat(snapshot.data().chat.sort(sortMessagesByDate));
        });

        return () => {
            _teachingRoomRef.onSnapshot(() => {
            })
        }
    }, [teachingRoomRef])

    return (
        <div className="teaching-room-container">
            {!showWaitingRoomDialog &&
                <div className="teaching-room-content">
                    haho
                </div>
            }
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
                    otherUID={privateLesson[otherRole + "UID"]}
                    setShowWaitingRoomDialog={setShowWaitingRoomDialog}
                />
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        users: state.firestore.data.users,
    };
};

export default compose(
    firestoreConnect([{collection: "users"}]),
    connect(mapStateToProps)
)(TeachingRoom);