import React, {useCallback, useEffect, useRef, useState} from "react";
import {firestoreConnect, getFirebase} from "react-redux-firebase";
import {InputText} from "primereact/inputtext";
import {compose} from "redux";
import {connect} from "react-redux";
import TutorProfileDialog from "../dialogs/TutorProfileDialog";
import {Dialog} from "primereact/dialog";
import TutorWaitingRoom from "../dialogs/WaitingRoomDialog";

const TutorTeachingRoom = (props) => {
    const [showWaitingRoomDialog, setShowWaitingRoomDialog] = useState(true);

    return (
        <div className="teaching-room-container">
            <div className="teaching-room-content"></div>
            <Dialog header="Várószoba"
                    visible={showWaitingRoomDialog}
                    position={"bottom"}
                    modal
                    onHide={() => setShowWaitingRoomDialog(false)}
                    draggable={false}
                    resizable={false}
                    closable={false}
                    className="waiting-room-dialog"
            >
                <TutorWaitingRoom/>
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        teachingRooms: state.firestore.ordered.teachingRooms
    };
};

export default compose(
    firestoreConnect([{collection: "teachingRooms"}]),
    connect(mapStateToProps)
)(TutorTeachingRoom);