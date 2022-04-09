import React from "react";
import "../../assets/css/dialogs/tutor-profile-dialog.css"
import profilePicturePlaceholder from "../../assets/img/profile-picture-placeholder.png";
import {Image} from "primereact/image";
import {editorHeader} from "../../util/FormFields";
import {Editor} from "primereact/editor";
import {Chips} from "primereact/chips";
import Timetable from "../tutor/Timetable";
import {Button} from "primereact/button";

const TutorProfileDialog = (props) => {

    return (
        <div className="tutor-profile-dialog-content">
            <Image
                src={props.data.profile.profilePictureUrl ? props.data.profile.profilePictureUrl : profilePicturePlaceholder}
                alt={props.data.profile.personalData.fullName + ' profile picture'}
            />
            <p className="tutor-profile-dialog-name">{props.data.profile.personalData.fullName}</p>
            <div className="tutor-profile-dialog-introduction">
                <p>Bemutatkozás</p>
                <Editor
                    headerTemplate={editorHeader}
                    value={props.data.tutor.advertisement.introduction}
                    readOnly
                />
            </div>
            <div className="tutor-profile-dialog-subjects">
                <p>Tanított tárgyak</p>
                <Chips value={props.data.tutor.advertisement.subjects.map((subject) => subject.name)}
                       removable={false}
                       readOnly
                />
            </div>
            <div className="tutor-profile-dialog-timetable">
                <p>Órarend</p>
                <Timetable timetable={props.data.tutor.advertisement.timetable}
                           setNewAdvertisement={null}
                           readonly={true}
                />
            </div>

            <Button label="Üzenet küldése"
                    className="tutor-profile-dialog-message"
            />

        </div>
    )
}


export default (TutorProfileDialog);