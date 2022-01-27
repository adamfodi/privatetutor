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
import {clearCourses, modifyCourseApplicants} from "../redux/actions/courseActions";

const Main = props => {
    const {auth, role, courses, users, error, success} = props;
    const [descriptionDialog, setDescriptionDialog] = useState(false);
    const [tutorDialog, setTutorDialog] = useState(false);
    const [currentRowDataValue, setCurrentRowDataValue] = useState(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);
    const [successValue, setSuccessValue] = useState(null);

    const filters = {
        'subject': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'tutorFullName': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    };

    useEffect(() => {
        if (success) {
            setSuccessDialog(true);
        }

        if (error) {
            setErrorDialog(true);
        }

        return () => {
            props.clearCourses();
        }

    }, [success, error, props]);

    const header = () => {
        return (
            <div className="datatable-title">
                <span>Meghirdetett kurzusok</span>
            </div>
        )
    };

    const applyButton = (rowData) => {
        if (!auth.uid || role === 'tutor' || rowData.tutorUID === auth.uid) {
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

    const limit = (rowData) => {
        return (
            <p>
                <span>{rowData.applicants.length + '/' + rowData.limit}</span>
            </p>
        );
    };

    const dateMerged = (rowData) => {
        return (
            <p>
                <span>{rowData.startDate + ' - ' + rowData.endDate}</span>
            </p>
        );
    };

    const tutor = (rowData) => {
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

    const description = (rowData) => {
        return (
            <p className="datatable-button">
                <Button
                    label="Megtekintés"
                    className="p-button-info"
                    onClick={() => descriptionClickHandler(rowData)}
                />
            </p>
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
        setSuccessValue("apply");
        let newApplicants = [...rowData.applicants];
        newApplicants.push(auth.uid);
        props.modifyCourseApplicants(rowData.id, newApplicants);
    };

    const dropCourse = (rowData) => {
        setSuccessValue("drop");
        let newApplicants = [...rowData.applicants];
        let index = newApplicants.findIndex(() => auth.uid);
        newApplicants.splice(index, 1);
        props.modifyCourseApplicants(rowData.id, newApplicants);
    };

    const hideCourseDialog = () => {
        setSuccessValue(null);
        setSuccessDialog(null);
        setErrorDialog(null);
    };

    const dialogCourseFooter = (
        <React.Fragment>
            <Button
                label="Rendben"
                icon="pi pi-check"
                className="p-button-text"
                onClick={hideCourseDialog}/>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <div className="datatable-container">
                <DataTable
                    value={courses}
                    loading={!courses && !role}
                    paginator
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
                        style={{minWidth: '14rem', maxWidth: '14rem'}}
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
                        sortable
                        style={{minWidth: '8rem', maxWidth: '8rem', textAlign: 'center'}}
                    />
                    <Column
                        field="applicants"
                        header="Létszám"
                        body={limit}
                        exportable={false}
                        sortable
                        style={{minWidth: '8rem', maxWidth: '8rem', textAlign: 'center'}}
                    />
                    <Column
                        field="startDate"
                        header="Időpont"
                        body={dateMerged}
                        exportable={false}
                        sortable
                        style={{minWidth: '20rem', maxWidth: '20rem', textAlign: 'center'}}
                    />
                    <Column
                        field="tutorFullName"
                        header="Oktató"
                        filter
                        showFilterMenu={false}
                        filterPlaceholder="Keresés..."
                        body={tutor}
                        exportable={false}
                        sortable
                        style={{minWidth: '12rem', maxWidth: '12rem', textAlign: 'center'}}
                    />
                    <Column
                        field="description"
                        header="Leírás"
                        body={description}
                        exportable={false}
                        style={{minWidth: '14rem', maxWidth: '14rem'}}
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


                <Dialog
                    visible={successDialog}
                    style={{width: '30em'}}
                    modal
                    className="p-fluid"
                    footer={dialogCourseFooter}
                    onHide={hideCourseDialog}
                >

                    <div className="field">
                        {
                            successValue === 'apply'
                                ? <span className="successCourse"> Sikeres jelentkezés!</span>
                                : null
                        }

                        {
                            successValue === 'drop'
                                ? <span className="successCourse"> Sikeres lejelentkezés!</span>
                                : null
                        }
                    </div>

                </Dialog>

                <Dialog
                    visible={errorDialog}
                    style={{width: '30em'}}
                    modal
                    className="p-fluid"
                    footer={dialogCourseFooter}
                    onHide={hideCourseDialog}
                >

                    <div className="field">
                        <span className="errorCourse">Hiba történt!</span>
                    </div>

                </Dialog>
            </div>
        </React.Fragment>

    )
}


const mapStateToProps = state => {
    return {
        courses: state.firestore.ordered.courses,
        users: state.firestore.ordered.users,
        auth: state.firebase.auth,
        role: state.user.role,
        error: state.courses.modificationError,
        success: state.courses.modificationSuccess,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        modifyCourseApplicants: (courseID, newApplicants) => dispatch(modifyCourseApplicants(courseID, newApplicants)),
        clearCourses: () => dispatch(clearCourses())
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([{collection: "courses", orderBy: ["startDate", "asc"]}]),
    firestoreConnect([{collection: "users"}])
)(Main);