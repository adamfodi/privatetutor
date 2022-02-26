import {connect} from "react-redux";
import {Column} from "primereact/column";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {DataTable} from "primereact/datatable";
import {FilterMatchMode} from "primereact/api";
import React, {useEffect, useState} from "react";
import "../assets/css/main.css"
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import moment from "moment";
import {CourseService} from "../services/CourseService";
import Swal from "sweetalert2";

const Main = props => {
    const {auth, courses, users} = props;
    const [descriptionDialog, setDescriptionDialog] = useState(false);
    const [tutorDialog, setTutorDialog] = useState(false);
    const [currentRowDataValue, setCurrentRowDataValue] = useState(null);

    const filters = {
        'subject': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'tutorFullName': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    };

    const header = () => {
        return (
            <div className="datatable-title">
                <span>Meghirdetett kurzusok</span>
            </div>
        )
    };

    const applyButton = (rowData) => {
        if (!auth.uid || rowData.tutorUID === auth.uid) {
            return null;
        }

        if (rowData.applicants.includes(auth.uid)) {
            return (
                <div className="datatable-button">
                    <Button label="Leadás" className="p-button-danger" onClick={() => dropCourse(rowData)}/>
                </div>
            )
        } else if (rowData.applicants.length === rowData.limit) {
            return (
                <div className="datatable-button">
                    <Button style={{opacity: '1'}} label="Betelt" className="p-button-danger" disabled/>
                </div>
            )
        } else {
            return (
                <div className="datatable-button">
                    <Button label="Jelentkezés" className="p-button-success" onClick={() => applyCourse(rowData)}/>
                </div>
            )
        }
    }

    const limitTemplate = (rowData) => {
        return (
            <p>
                <span>{rowData.applicants.length + '/' + rowData.limit}</span>
            </p>
        );
    };

    const dateTemplate = (rowData) => {
        return (
            <p>
                <span>{moment(rowData.date.toDate()).format('YYYY. MMMM DD. - dddd ')}</span>
            </p>
        );
    };

    const timeTemplate = (rowData) => {
        return (
            <p>
                <span>{rowData.startTime + ' - ' + rowData.endTime}</span>
            </p>
        );
    };

    const tutorTemplate = (rowData) => {
        return (
            <p>
                <span
                    className="datatable-tutor"
                    onClick={() => tutorClickHandler(rowData)}>
                    {rowData.tutorFullName}
                </span>
            </p>
        );
    };

    const tutorClickHandler = (rowData) => {
        let index = users.findIndex(u => u.id === rowData.tutorUID);
        setCurrentRowDataValue(users[index]);
        console.log(users[index].fullName)
        setTutorDialog(true);
    };

    const hideTutorDialog = () => {
        setTutorDialog(false);
        setCurrentRowDataValue(null);
    };

    const dialogTutorFooter = (
        <React.Fragment>
            <Button
                label="Rendben"
                icon="pi pi-check"
                className="p-button-text"
                onClick={hideTutorDialog}/>
        </React.Fragment>
    );

    const descriptionTemplate = (rowData) => {
        return (
            <div className="datatable-button">
                <Button
                    label="Megtekintés"
                    className="p-button-info"
                    onClick={() => descriptionClickHandler(rowData)}
                />
            </div>
        );
    };

    const descriptionClickHandler = (rowData) => {
        setCurrentRowDataValue(rowData.description);
        setDescriptionDialog(true);
    };

    const hideDescriptionDialog = () => {
        setDescriptionDialog(false);
        setCurrentRowDataValue(null);
    };

    const dialogDescriptionFooter = (
        <React.Fragment>
            <Button
                label="Rendben"
                icon="pi pi-check"
                className="p-button-text"
                onClick={hideDescriptionDialog}/>
        </React.Fragment>
    );

    const applyCourse = (rowData) => {
        let newApplicants = [...rowData.applicants];
        newApplicants.push(auth.uid);
        CourseService.modifyCourseApplicants(rowData.id, newApplicants)
            .then(() => {
                Swal.fire({
                    position: 'center',
                    confirmButtonColor: '#3085d6',
                    allowOutsideClick: false,
                    icon: 'success',
                    title: 'Sikeres jelentkezés!'
                })
            })
            .catch(() => {
                Swal.fire({
                    position: 'center',
                    confirmButtonColor: '#3085d6',
                    allowOutsideClick: false,
                    icon: 'error',
                    iconColor: '#c91e1e',
                    title: 'Sikertelen jelentkezés!'
                });
            });
    };

    const dropCourse = (rowData) => {
        let newApplicants = [...rowData.applicants];
        let index = newApplicants.findIndex(() => auth.uid);
        newApplicants.splice(index, 1);
        CourseService.modifyCourseApplicants(rowData.id, newApplicants)
            .then(() => {
                Swal.fire({
                    position: 'center',
                    confirmButtonColor: '#3085d6',
                    allowOutsideClick: false,
                    icon: 'success',
                    title: 'Sikeres lejelentkezés!'
                })
            })
            .catch(() => {
                Swal.fire({
                    position: 'center',
                    confirmButtonColor: '#3085d6',
                    allowOutsideClick: false,
                    icon: 'error',
                    iconColor: '#c91e1e',
                    title: 'Sikertelen lejelentkezés!'
                });
            });
    };

    return (
        <React.Fragment>
            <div className="datatable-container">
                <DataTable
                    value={courses}
                    loading={!courses && !auth.uid}
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Összes meghirdetett kurzus száma: {totalRecords}"
                    responsiveLayout="scroll"
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="row"
                    header={header}
                    emptyMessage="Nem található kurzus."
                >
                    <Column
                        body={applyButton}
                        exportable={false}
                        style={{minWidth: '10rem', maxWidth: '10rem'}}
                    />
                    <Column
                        field="subject"
                        header="Tantárgy"
                        filter
                        showFilterMenu={false}
                        exportable={false}
                        filterPlaceholder="Keresés..."
                        sortable
                        style={{minWidth: '13rem', maxWidth: '13rem', textAlign: 'center'}}
                    />
                    <Column
                        field="price"
                        header="Ár (Ft / fő)"
                        showFilterMenu={false}
                        exportable={false}
                        sortable
                        style={{minWidth: '8rem', maxWidth: '8rem', textAlign: 'center'}}
                    />
                    <Column
                        field="applicants"
                        header="Létszám"
                        body={limitTemplate}
                        exportable={false}
                        sortable
                        style={{minWidth: '8rem', maxWidth: '8rem', textAlign: 'center'}}
                    />
                    <Column
                        field="date"
                        header="Dátum"
                        body={dateTemplate}
                        exportable={false}
                        sortable
                        style={{minWidth: '10rem', maxWidth: '10rem', textAlign: 'center'}}
                    />
                    <Column
                        field="startTime"
                        header="Időpont"
                        body={timeTemplate}
                        exportable={false}
                        sortable
                        style={{minWidth: '10rem', maxWidth: '10rem', textAlign: 'center'}}
                    />
                    <Column
                        field="tutorFullName"
                        header="Oktató"
                        filter
                        showFilterMenu={false}
                        filterPlaceholder="Keresés..."
                        body={tutorTemplate}
                        exportable={false}
                        sortable
                        style={{minWidth: '12rem', maxWidth: '12rem', textAlign: 'center'}}
                    />
                    <Column
                        field="description"
                        header="Leírás"
                        body={descriptionTemplate}
                        exportable={false}
                        style={{minWidth: '12rem', maxWidth: '12rem'}}
                    />
                </DataTable>
            </div>

            <div>
                <Dialog
                    visible={tutorDialog}
                    style={{width: '30em', height: '30em'}}
                    header="Oktató adatai"
                    modal
                    className="p-fluid"
                    footer={dialogTutorFooter}
                    onHide={hideTutorDialog}
                >

                    <div className="field">
                        {currentRowDataValue
                            ? <div>
                                <h1 style={{textAlign: "center"}}>{currentRowDataValue.fullName}</h1>
                                <p>Elérhetőség: {currentRowDataValue.email}</p>
                                <p> TODO: picture</p>
                                <p> TODO: rating</p>
                                <p> TODO: introduction</p>
                                <p> TODO: send message</p>
                            </div>
                            : null
                        }

                    </div>

                </Dialog>

                <Dialog
                    visible={descriptionDialog}
                    style={{width: '30em'}}
                    header="Leírás"
                    modal
                    className="p-fluid"
                    footer={dialogDescriptionFooter}
                    onHide={hideDescriptionDialog}
                >

                    <div className="field">
                        <InputTextarea
                            value={currentRowDataValue ? currentRowDataValue : ''}
                            rows={15}
                            cols={25}
                            style={{opacity: '1'}}
                            autoResize
                            disabled
                        />
                    </div>

                </Dialog>
            </div>
        </React.Fragment>

    )
}


const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        courses: state.firestore.ordered.courses,
        users: state.firestore.ordered.users
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "courses", orderBy: ["date", "asc"]}]),
    firestoreConnect([{collection: "users"}])
)(Main);