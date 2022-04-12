import {connect} from "react-redux";
import {compose} from "redux";
import React, {useEffect, useState} from "react";
import {firestoreConnect} from "react-redux-firebase";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import moment from "moment";
import 'moment/locale/hu'
import "../../assets/css/student/student-private-lessons.css"
import {Tag} from "primereact/tag";
import {PrivateLessonService} from "../../services/PrivateLessonService";
import {TeachingRoomService} from "../../services/TeachingRoomService";
import {useNavigate} from "react-router-dom";

const StudentPrivateLessons = props => {
    const {auth, users, privateLessons} = props;
    const navigate = useNavigate();
    const [myPrivateLessons, setMyPrivateLessons] = useState([]);

    moment.locale('hu')

    useEffect(() => {
        if (auth.uid && privateLessons && users) {
            setMyPrivateLessons(privateLessons.filter((privateLesson) => privateLesson.studentUID === auth.uid)
                .map((privateLesson => {
                    const profile = users.filter((user) => user.id === privateLesson.tutorUID);
                    return {
                        ...privateLesson, tutorProfile: profile[0]
                    }
                }))
            )
        }
    }, [auth.uid, privateLessons, users])

    const tutorBodyTemplate = (rowData) => {
        const currentTime = new Date();
        return (
            <div>
                <p>{rowData.tutorProfile && rowData.tutorProfile.profile.personalData.fullName}</p>
                {rowData.status === 'accepted' &&
                    <Button label="Csatlakozás"
                            onClick={() => navigate("/teaching-room/" + rowData.roomURL)}
                            disabled={rowData.dateFrom.toDate > currentTime || rowData.dateTo.toDate() < currentTime}
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
        <div className="student-private-lessons-container">
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
                    emptyMessage="Nem található magánóra."
                >
                    <Column field="tutorUID"
                            header="Oktató"
                            sortable
                            body={tutorBodyTemplate}
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

                    <Column body={responseBodyTemplate}/>
                </DataTable>
            </div>
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
)(StudentPrivateLessons);