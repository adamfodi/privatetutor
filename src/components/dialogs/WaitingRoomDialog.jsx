import React, {useEffect, useRef, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import placeholder from "../../assets/img/profile-picture-placeholder.png";
import {Image} from "primereact/image";
import {Button} from "primereact/button";

const WaitingRoomDialog = props => {
    const {role, auth, privateLessons, teachingRooms} = props;
    const [chat, setChat] = useState(null);

    return (
        <div className="tutor-waiting-room-container">
            <div>
                    <div>
                        <Image src={placeholder}
                               alt="Profile Picture"
                               preview
                               downloadable
                        />
                    </div>
                    <div>
                        {
                            props.role === 'tutor'
                                ? <Button
                                    label="Óra indítása"
                                    onClick={() => {
                                    }}
                                />
                                : <Button
                                    label="Csatlakozás"
                                    onClick={() => {
                                    }}
                                />
                        }
                    </div>
            </div>
            <div>
                chat
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
)(WaitingRoomDialog);