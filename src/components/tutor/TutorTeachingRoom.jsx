import React, {useEffect, useMemo, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import {Dialog} from "primereact/dialog";
import TutorWaitingRoom from "../dialogs/WaitingRoomDialog";
import {useNavigate} from "react-router-dom";

const TutorTeachingRoom = (props) => {
    const {privateLesson, firebaseAuth, users, teachingRooms} = props;
    const navigate = useNavigate();
    const [showWaitingRoomDialog, setShowWaitingRoomDialog] = useState(true);
    const [chat, setChat] = useState([]);
    const roles = useRef({
        myRole: firebaseAuth.uid === privateLesson.tutorUID ? "tutor" : "student",
        otherRole: firebaseAuth.uid === privateLesson.tutorUID ? "student" : "tutor",
    })
    const teachingRoomRef = useRef(getFirebase().firestore().collection('teachingRooms').doc(privateLesson.roomID));

    const otherUserProfile = useMemo(() => {
        return users && users[privateLesson[roles.current.otherRole + "UID"]]
    }, [privateLesson, users])

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
                    onHide={() => navigate("/tutor/private-lessons")}
                    draggable={false}
                    resizable={false}
                    // closable={false}
                    className="waiting-room-dialog"
            >
                <TutorWaitingRoom
                    chat={chat}
                    role={roles.current.myRole}
                    roomID={privateLesson.roomID}
                    otherUserProfile={otherUserProfile}
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
        teachingRooms: state.firestore.ordered.teachingRooms
    };
};

export default compose(
    firestoreConnect([{collection: "teachingRooms"}]),
    connect(mapStateToProps)
)(TutorTeachingRoom);