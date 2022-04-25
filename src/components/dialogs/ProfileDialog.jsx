import React, {useState} from "react";
import "../../assets/css/dialogs/profile-dialog.css"
import profilePicturePlaceholder from "../../assets/img/profile-picture-placeholder.png";
import {Image} from "primereact/image";
import {editorHeader} from "../../util/FormFields";
import {Editor} from "primereact/editor";
import {Chips} from "primereact/chips";
import Timetable from "../Timetable";
import {Button} from "primereact/button";
import moment from "moment";
import MessageDialog from "./MessageDialog";
import {Dialog} from "primereact/dialog";
import {connect} from "react-redux";

const ProfileDialog = (props) => {
    const [showMessageDialog, setShowMessageDialog] = useState(false);

    moment.locale('hu')

    const setNewMessageTemplate = () => {

        return props.firebaseAuth.uid
            ? {
                fromUID: props.firebaseAuth.uid,
                fromName: props.profile.personalData.fullName,
                toUID: props.data.id,
                toName: props.data.profile.personalData.fullName,
            }
            : null
    }

    return (
        <>
            <div className="profile-dialog-content">
                <Image
                    src={props.data.profile.profilePictureUrl ? props.data.profile.profilePictureUrl : profilePicturePlaceholder}
                    alt={props.data.profile.personalData.fullName + ' profile picture'}
                />
                <p className="name">{props.data.profile.personalData.fullName}</p>
                <div className="personal-data-div">
                    <p>Személyes adatok</p>
                    <div>
                        <div>
                            <p>Születésnap:</p>
                            <p>{moment(props.data.profile.personalData.birthday.toDate()).format("YYYY. MMMM. Do ")}</p>
                        </div>
                        <div>
                            <p>Email:</p>
                            <p>{props.data.profile.personalData.email}</p>
                        </div>
                        <div>
                            <p>Telefonszám:</p>
                            <p>+3631234565</p>
                        </div>
                    </div>
                </div>
                <div className="introduction-div">
                    <p>Bemutatkozás</p>
                    <Editor
                        headerTemplate={editorHeader}
                        value={props.data.tutor.advertisement.introduction}
                        readOnly
                    />
                </div>
                <div className="subjects-div">
                    <p>Oktatott tárgyak</p>
                    <Chips
                        value={props.data.tutor.advertisement.subjects.map((subject) => subject.name)}
                        removable={false}
                        readOnly
                    />
                </div>
                <div className="timetable-div">
                    <p>Órarend</p>
                    <Timetable timetable={props.data.tutor.advertisement.timetable}
                               setNewAdvertisement={null}
                               readonly={true}
                    />
                </div>

                {props.firebaseAuth.uid && props.firebaseAuth.uid !== props.data.id &&
                    <Button
                        label="Üzenet küldése"
                        className="send-message"
                        onClick={() => setShowMessageDialog(true)}
                    />
                }


            </div>
            <Dialog
                header="Üzenet küldése"
                visible={showMessageDialog}
                position={"center"}
                modal
                onHide={() => setShowMessageDialog(false)}
                resizable={false}
                draggable={false}
                className="message-dialog"
            >
                <MessageDialog
                    message={setNewMessageTemplate()}
                    type="new"
                    setShowMessageDialog={setShowMessageDialog}
                />
            </Dialog>
        </>
    )
}


const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        profile: !state.firebase.auth.isEmpty && !state.firebase.profile.isEmpty
            ? state.firebase.profile.profile
            : null
    };
};

export default connect(mapStateToProps)(ProfileDialog);