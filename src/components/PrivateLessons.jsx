import {connect} from "react-redux";
import {compose} from "redux";
import React, {useEffect, useState} from "react";
import {firestoreConnect} from "react-redux-firebase";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import moment from "moment";
import 'moment/locale/hu'
import "../assets/css/private-lessons.css"
import {Tag} from "primereact/tag";
import {useNavigate} from "react-router-dom";
import PrivateLessonDialog from "./dialogs/PrivateLessonDialog";
import {PrivateLessonService} from "../services/PrivateLessonService";
import {TeachingRoomService} from "../services/TeachingRoomService";
import placeholder from "../assets/img/profile-picture-placeholder.png";
import {Image} from "primereact/image";
import ProfileDialog from "./dialogs/ProfileDialog";
import FeedbackDialog from "./dialogs/FeedbackDialog";

const PrivateLessons = props => {
    const {role, firebaseAuth, users, privateLessons, teachingRooms} = props;
    const [otherRole] = useState(role === "tutor" ? "student" : "tutor");
    const navigate = useNavigate();
    const [myPrivateLessons, setMyPrivateLessons] = useState([]);
    const [showPrivateLessonDialog, setShowPrivateLessonDialog] = useState(false);
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [currentFeedbackUID, setCurrentFeedbackUID] = useState(null);
    const [currentPrivateLessonID, setCurrentPrivateLessonID] = useState(null);

    moment.locale('hu')

    useEffect(() => {
        if (firebaseAuth.uid && users && privateLessons) {
            setMyPrivateLessons(privateLessons.filter(privateLesson => privateLesson[role + "UID"] === firebaseAuth.uid)
            )
        }
    }, [firebaseAuth.uid, users, privateLessons, role])

    const checkIfUserAlreadyInTheRoom = (roomID) => {
        if (teachingRooms) {
            if (role === "tutor") {
                const room = teachingRooms[roomID];
                return !!room.offer
            }

            if (role === "student") {
                const room = teachingRooms[roomID];
                return !!room.answer
            }
        }
    }

    const tableHeaderTemplate = (
        <div>
            <Button
                label="Új magánóra létrehozása"
                className="p-button-help"
                onClick={() => setShowPrivateLessonDialog(true)}
            />
        </div>
    )

    const userPictureAndProfileBodyTemplate = rowData => {
        const user = users.filter(user => user.id === rowData[otherRole + "UID"])[0];
        return (
            <div>
                <Image
                    src={user && user.profile.profilePictureUrl ? user.profile.profilePictureUrl : placeholder}
                    alt="Profile Picture"
                />

                <Button
                    label="Profil"
                    onClick={() => {
                        setCurrentUserProfile(user);
                        setShowProfileDialog(true)
                    }}
                />
            </div>
        )
    }

    const userNameBodyTemplate = rowData => {
        const user = users.filter(user => user.id === rowData[otherRole + "UID"])[0];
        const userFullName = user ? user.profile.personalData.fullName : '';
        return (
            <p>{userFullName}</p>
        )
    }

    const joinRoomAndFeedbackBodyTemplate = rowData => {
        const currentTime = new Date();

        if (rowData.status === 'accepted' && rowData.dateTo.toDate() > currentTime) {
            return (
                <div>
                    <Button
                        label="Belépés"
                        className="p-button-success"
                        onClick={() => navigate("/teaching-room",
                            {
                                state:
                                    {
                                        privateLesson: {...rowData, dateTo: rowData.dateTo.toDate()},
                                        otherRole: otherRole
                                    }
                            }
                        )}
                        disabled={(rowData.dateFrom.toDate() > currentTime || rowData.dateTo.toDate() < currentTime)
                            || checkIfUserAlreadyInTheRoom(rowData.roomID)}
                    />
                </div>
            )
        }

        if (rowData.status === 'finished') {
            if (role === "tutor") {
                return (
                    <div>
                        <Button
                            label={rowData.tutorFeedback ? "Értékelve" : "Értékelés"}
                            className="p-button-info"
                            onClick={() => {
                                setCurrentFeedbackUID(rowData.studentUID);
                                setCurrentPrivateLessonID(rowData.id);
                                setShowFeedbackDialog(true)
                            }}
                            disabled={rowData.tutorFeedback}
                        />
                    </div>
                )
            }

            if (role === "student") {
                return (
                    <div>
                        <Button
                            label={rowData.studentFeedback ? "Értékelve" : "Értékelés"}
                            className="p-button-info"
                            onClick={() => {
                                setCurrentFeedbackUID(rowData.tutorUID);
                                setCurrentPrivateLessonID(rowData.id);
                                setShowFeedbackDialog(true)
                            }}
                            disabled={rowData.studentFeedback}
                        />
                    </div>
                )
            }
        }

        return null;
    }

    const timeBodyTemplate = (rowData) => {
        return (
            <p>
                {moment(rowData.dateFrom.toDate()).format('HH:mm')}
                {" - "}
                {moment(rowData.dateTo.toDate()).format('HH:mm')}
            </p>
        )
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <p>
                    {moment(rowData.dateFrom.toDate()).format('YYYY. MMMM DD.')}
                </p>
                <p>
                    {moment(rowData.dateFrom.toDate()).format('dddd')}
                </p>
            </>
        )
    }

    const statusBodyTemplate = (rowData) => {
        const currentTime = new Date();
        if (rowData.dateTo.toDate() <= currentTime && rowData.status === "accepted") {
            PrivateLessonService.modifyPrivateLessonStatus(rowData.id, "finished")
        }
        switch (rowData.status) {
            case "pending":
                return (
                    <Tag icon="pi pi-question"
                         severity="warning"
                         value="Függőben"
                    />
                )

            case "accepted":
                return (
                    <Tag icon="pi pi-check"
                         severity="success"
                         value="Elfogadva"
                    />
                )

            case "rejected":
                return (
                    <Tag icon="pi pi-times"
                         severity="danger"
                         value="Elutasítva"
                    />
                )

            case "finished":
                return (
                    <Tag icon="pi pi-lock"
                         severity="secondary"
                         value="Befejezett"
                    />
                )

            default:
                return null
        }
    }

    const responseBodyTemplate = (rowData) => {
        const currentTime = new Date();

        if (rowData.dateFrom.toDate() >= currentTime) {
            if (rowData.status === "pending" && role === "student") {
                return (
                    <div>
                        <Button label="Elfogadás"
                                className="p-button-success"
                                onClick={() => {
                                    PrivateLessonService.modifyPrivateLessonStatus(rowData.id, "accepted")
                                        .then(() => {
                                            TeachingRoomService.createRoom(rowData.roomID)
                                        })
                                }}
                        />
                        <Button label="Elutasítás"
                                className="p-button-danger"
                                onClick={() => PrivateLessonService.modifyPrivateLessonStatus(rowData.id, "rejected")}
                        />
                    </div>
                )
            }
            if (rowData.status === "accepted") {
                return (
                    <div>
                        <Button label="Lemondás"
                                className="p-button-danger"
                                onClick={() => PrivateLessonService.modifyPrivateLessonStatus(rowData.id, "rejected")}
                        />
                    </div>
                )
            }
        }
    }

    return (
        <div className="private-lessons-container">
            <p className="title">Magánóráim</p>
            <div className="datatable-container">
                <DataTable
                    value={myPrivateLessons}
                    loading={!myPrivateLessons}
                    paginator
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Találatok száma: {totalRecords}"
                    responsiveLayout="scroll"
                    rows={5}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    header={role === "tutor" && tableHeaderTemplate}
                    emptyMessage="Nem található magánóra."
                >
                    <Column
                        body={userPictureAndProfileBodyTemplate}
                        className="picture-and-profile-td"
                    />

                    <Column
                        header="Név"
                        body={userNameBodyTemplate}
                        className="user-name-td"
                    />

                    <Column
                        body={joinRoomAndFeedbackBodyTemplate}
                            className="join-feedback-td"
                    />

                    <Column
                        header="Időpont"
                        body={timeBodyTemplate}
                        className="time-td"
                    />

                    <Column
                        field="dateFrom"
                        header="Nap"
                        sortable
                        body={dateBodyTemplate}
                        className="date-td"
                    />

                    <Column
                        field="status"
                        sortable
                        header="Állapot"
                        body={statusBodyTemplate}
                    />

                    <Column
                        body={responseBodyTemplate}
                        className="response-td"
                    />
                </DataTable>
            </div>
            <Dialog header="Új magánóra létrehozása"
                    visible={showPrivateLessonDialog}
                    position={"center"}
                    modal
                    onHide={() => setShowPrivateLessonDialog(false)}
                    resizable={false}
                    draggable={false}
                    className="private-lesson-dialog"
            >
                <PrivateLessonDialog
                    setShowNewPrivateLessonDialog={setShowPrivateLessonDialog}
                    myPrivateLessons={myPrivateLessons}
                />
            </Dialog>
            <Dialog header="Profil"
                    visible={showProfileDialog}
                    position={"center"}
                    modal
                    onHide={() => setShowProfileDialog(false)}
                    draggable={false}
                    resizable={false}
                    className="profile-dialog"
            >
                <ProfileDialog
                    data={currentUserProfile}
                />
            </Dialog>
            <Dialog header="Értékelés"
                    visible={showFeedbackDialog}
                    position={"center"}
                    modal
                    onHide={() => setShowFeedbackDialog(false)}
                    draggable={false}
                    resizable={false}
                    className="feedback-dialog"
            >
                <FeedbackDialog
                    setShowFeedbackDialog={setShowFeedbackDialog}
                    feedbackUID={currentFeedbackUID}
                    privateLessonID={currentPrivateLessonID}
                    role={role}
                />
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        role: state.role,
        firebaseAuth: state.firebase.auth,
        users: state.firestore.ordered.users,
        privateLessons: state.firestore.ordered.privateLessons,
        teachingRooms: state.firestore.data.teachingRooms,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}]),
    firestoreConnect([{collection: "privateLessons"}]),
    firestoreConnect([{collection: "teachingRooms"}])
)(PrivateLessons);