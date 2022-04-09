import React, {useEffect, useRef, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";

const TeachingRoom = props => {
    const {role, auth, privateLessons, teachingRooms} = props;
    const [chat, setChat] = useState(null);

    return (
        <div className="teaching-room-container">
            <div className="timer">
                ido
            </div>
            <div>
                <div className="chat-div">
                </div>
                <div className="cameras-div">
                </div>
                <div className="files-div">
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        privateLessons: state.firestore.ordered.privateLessons,
        teachingRooms: state.firestore.ordered.teachingRooms
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "privateLessons"}]),
    firestoreConnect([{collection: "teachingRooms"}])
)(TeachingRoom);