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
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import PrivateLessonDialog from "./dialogs/PrivateLessonDialog";
import {PrivateLessonService} from "../services/PrivateLessonService";
import {TeachingRoomService} from "../services/TeachingRoomService";
import placeholder from "../assets/img/profile-picture-placeholder.png";
import {Image} from "primereact/image";

const PrivateLessons = props => {
    const {firebaseAuth, users, privateLessons, role} = props;
    const [otherRole]= useState(role === "tutor" ? "student" : "tutor");
    const navigate = useNavigate();
    const [myPrivateLessons, setMyPrivateLessons] = useState([]);
    const [showPrivateLessonDialog, setShowPrivateLessonDialog] = useState(false);

    moment.locale('hu')

    useEffect(() => {
        if (firebaseAuth.uid && users && privateLessons) {
            setMyPrivateLessons(privateLessons.filter(privateLesson => privateLesson[role + "UID"] === firebaseAuth.uid)
            )
        }
    }, [firebaseAuth.uid, users, privateLessons, role])

    const deletePrivateLesson = (privateLessonID, roomID) => {
        Swal.fire({
            title: 'Biztosan törölni szeretné?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Igen',
            cancelButtonText: 'Mégse',
            allowEscapeKey: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                PrivateLessonService.deletePrivateLesson(privateLessonID)
                    .then(() => {
                        TeachingRoomService.deleteRoom(roomID)
                    })
                    .catch(() => {
                        Swal.fire({
                            position: 'center',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            icon: 'error',
                            iconColor: '#c91e1e',
                            title: 'Probléma történt!\n Kérem próbálja újra később!'
                        });
                    })
            }
        })
    }

    const tableHeaderTemplate = (
        <div>
            <Button
                label="Új magánóra létrehozása"
                onClick={() => setShowPrivateLessonDialog(true)}
            />
        </div>
    )

    const otherUserPictureBodyTemplate = rowData => {
        const otherUser = users.filter(user => user.id === rowData[otherRole + "UID"])[0];
        return (
            <div>
                <Image
                    src={otherUser ? otherUser.profile.profilePictureUrl : placeholder}
                    alt="Profile Picture"
                />
            </div>
        )
    }

    const otherUserNameBodyTemplate = rowData => {
        const otherUser = users.filter(user => user.id === rowData[otherRole + "UID"])[0];
        const otherUserFullName = otherUser ? otherUser.profile.personalData.fullName : '';
        return (
            <div>
                {/*TODO: ProfileDialog onClick*/}
                <p>{otherUserFullName}</p>
            </div>
        )
    }

    const joinRoomBodyTemplate = rowData => {
        const currentTime = new Date();
        return (
            rowData.status === 'accepted' &&
            <div>
                <Button label="Csatlakozás"
                        onClick={() => navigate("/teaching-room", {state: {privateLesson: rowData, otherRole: otherRole}})}
                        disabled={rowData.dateFrom.toDate() > currentTime || rowData.dateTo.toDate() < currentTime}
                />
            </div>
        )
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

    const dayBodyTemplate = (rowData) => {
        return (
            <p>
                {moment(rowData.dateFrom.toDate()).format('YYYY. MMMM DD. - dddd ')}
            </p>
        )
    }

    const statusBodyTemplate = (rowData) => {
        switch (rowData.status) {
            case "pending":
                return (
                    <Tag icon="pi pi-question"
                         severity="info"
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
                    <Tag icon="pi pi-book"
                         severity="primary"
                         value="Befejezett"
                    />
                )

            default:
                return rowData.status
        }
    }

    const deleteBodyTemplate = (rowData) => {
        return (
            <div>
                <Button label="Törlés"
                        className="p-button-danger"
                        onClick={(() => deletePrivateLesson(rowData.id, rowData.roomID))}
                />
            </div>
        )
    }

    const responseBodyTemplate = (rowData) => {
        switch (rowData.status) {
            case "pending":
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

            case "accepted":
                return (
                    <div>
                        <Button label="Lemondás"
                                className="p-button-danger"
                                onClick={() => PrivateLessonService.modifyPrivateLessonStatus(rowData.id, "rejected")}
                        />
                    </div>
                )
            default:
                return null
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
                    <Column body={otherUserPictureBodyTemplate}/>

                    <Column
                        header="Név"
                        body={otherUserNameBodyTemplate}
                    />

                    <Column body={joinRoomBodyTemplate}/>

                    <Column
                        header="Időpont"
                        body={timeBodyTemplate}
                    />

                    <Column
                        field="dateFrom"
                        header="Nap"
                        sortable
                        body={dayBodyTemplate}
                    />

                    <Column
                        field="status"
                        sortable
                        header="Állapot"
                        body={statusBodyTemplate}
                    />

                    <Column body={role === "tutor" ? deleteBodyTemplate : responseBodyTemplate}/>
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
                <PrivateLessonDialog setShowNewPrivateLessonDialog={setShowPrivateLessonDialog}/>
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        users: state.firestore.ordered.users,
        privateLessons: state.firestore.ordered.privateLessons,
        role: state.role
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}]),
    firestoreConnect([{collection: "privateLessons"}])
)(PrivateLessons);