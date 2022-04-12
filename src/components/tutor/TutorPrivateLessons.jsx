import {connect} from "react-redux";
import {compose} from "redux";
import React, {useEffect, useState} from "react";
import {firestoreConnect} from "react-redux-firebase";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import NewPrivateLessonDialog from "../dialogs/PrivateLessonDialog";
import moment from "moment";
import 'moment/locale/hu'
import "../../assets/css/tutor/tutor-private-lessons.css"
import {Tag} from "primereact/tag";
import {PrivateLessonService} from "../../services/PrivateLessonService";
import Swal from "sweetalert2";
import {TeachingRoomService} from "../../services/TeachingRoomService";
import {useNavigate} from "react-router-dom";

const TutorPrivateLessons = props => {
    const {auth, users, privateLessons} = props;
    const navigate = useNavigate();
    const [myPrivateLessons, setMyPrivateLessons] = useState([]);
    const [showNewPrivateLessonDialog, setShowNewPrivateLessonDialog] = useState(false);

    moment.locale('hu')

    useEffect(() => {
        if (auth.uid && privateLessons && users) {
            setMyPrivateLessons(privateLessons.filter((privateLesson) => privateLesson.tutorUID === auth.uid)
                .map((privateLesson => {
                    const profile = users.filter((user) => user.id === privateLesson.studentUID);
                    return {
                        ...privateLesson, studentProfile: profile[0]
                    }
                }))
            )
        }
    }, [auth.uid, privateLessons, users])

    const deletePrivateLesson = (privateLessonID, roomID) => {
        Swal.fire({
            title: 'Biztosan törölni szeretné?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Igen',
            cancelButtonText: 'Mégse',
            confirmButtonColor: '#3085d6',
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
                            confirmButtonColor: '#3085d6',
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

    const headerTemplate = (
        <div>
            <Button
                label="Új magánóra létrehozása"
                onClick={() => setShowNewPrivateLessonDialog(true)}
            />
        </div>
    )

    const studentBodyTemplate = (rowData) => {
        const currentTime = new Date();
        return (
            <div>
                <p>{rowData.studentProfile && rowData.studentProfile.profile.personalData.fullName}</p>
                {rowData.status === 'accepted' &&
                    <Button label="Csatlakozás"
                            onClick={() => navigate("/teaching-room/" + rowData.roomURL)}
                            disabled={rowData.dateFrom.toDate() > currentTime || rowData.dateTo.toDate() < currentTime}
                    />
                }
            </div>
        )
    }

    const dayBodyTemplate = (rowData) => {
        return (
            <p>
                {moment(rowData.dateFrom.toDate()).format('YYYY. MMMM DD. - dddd ')}
            </p>
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

    return (
        <div className="tutor-private-lessons-container">
            <p className="title">Meghirdetett magánóráim</p>
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
                    header={headerTemplate}
                    emptyMessage="Nem található magánóra."
                >
                    <Column field="studentUID"
                            header="Hallgató"
                            sortable
                            body={studentBodyTemplate}
                    />

                    <Column field="dateFrom"
                            header="Nap"
                            sortable
                            body={dayBodyTemplate}
                    />

                    <Column header="Időpont"
                            body={timeBodyTemplate}
                    />

                    <Column field="status"
                            sortable
                            header="Állapot"
                            body={statusBodyTemplate}
                    />

                    <Column body={deleteBodyTemplate}/>
                </DataTable>
            </div>
            <Dialog header="Új magánóra létrehozása"
                    visible={showNewPrivateLessonDialog}
                    modal
                    onHide={() => setShowNewPrivateLessonDialog(false)}
                    resizable={false}
                    draggable={false}
                    className="private-lesson-dialog"
            >
                <NewPrivateLessonDialog setShowNewPrivateLessonDialog={setShowNewPrivateLessonDialog}/>
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
        privateLessons: state.firestore.ordered.privateLessons
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}]),
    firestoreConnect([{collection: "privateLessons"}])
)(TutorPrivateLessons);