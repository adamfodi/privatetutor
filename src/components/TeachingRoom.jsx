import React, {useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import {Dialog} from "primereact/dialog";
import {useLocation, useNavigate} from "react-router-dom";
import WaitingRoomDialog from "./dialogs/WaitingRoomDialog";
import TutorTeachingRoom from "./tutor/TutorWebRTC";
import TutorWebRTC from "./tutor/TutorWebRTC";

const TeachingRoom = (props) => {
    const {firebaseAuth, users, role} = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [showWaitingRoomDialog, setShowWaitingRoomDialog] = useState(true);
    const [chat, setChat] = useState([]);
    const [privateLesson] = useState(location.state.privateLesson);
    const [otherRole] = useState(location.state.otherRole);

    const peerConnection = useRef(null);
    const localStream = useRef(new MediaStream());
    const remoteStream = useRef(new MediaStream());
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

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
                    <div>
                        {
                            role === "tutor"
                                ? <TutorWebRTC/>
                                : <p/>
                        }
                    </div>
                    {/*<p>*/}
                    {/*    <video ref={localVideoRef} autoPlay playsInline/>*/}
                    {/*    <video ref={remoteVideoRef} autoPlay playsInline/>*/}
                    {/*</p>*/}
                </div>
            }
            <p>
                <video ref={localVideoRef} autoPlay playsInline/>
                <video ref={remoteVideoRef} autoPlay playsInline/>
            </p>
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
                    peerConnection={peerConnection}
                    localStream={localStream}
                    remoteStream={remoteStream}
                    localVideoRef={localVideoRef}
                    remoteVideoRef={remoteVideoRef}
                />
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        users: state.firestore.data.users,
        role: state.role
    };
};

export default compose(
    firestoreConnect([{collection: "users"}]),
    connect(mapStateToProps)
)(TeachingRoom);