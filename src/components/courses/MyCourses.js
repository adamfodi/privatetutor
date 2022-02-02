import {connect} from "react-redux";
import {Column} from "primereact/column";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {DataTable} from "primereact/datatable";
import {FilterMatchMode} from "primereact/api";
import React, {useEffect, useState} from "react";
import "../../assets/css/main.css"
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import {clearCourses, modifyCourseApplicants} from "../../redux/actions/courseActions";
import CourseDialog from "./CourseDialog";
import {useNavigate} from "react-router-dom";

const MyCourses = props => {
    const {auth, courses, creationError, creationSuccess, user} = props;
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState(null);
    const [descriptionDialog, setDescriptionDialog] = useState(false);
    const [currentRowDataValue, setCurrentRowDataValue] = useState(null);
    // const [creationSuccess, setShowCreationSuccess] = useState(false);
    // const [creationError, setShowCreationError] = useState(false);
    const [showCourseDialog, setShowCourseDialog] = useState(false);

    const navigate = useNavigate();

    const filters = {
        'subject': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'tutorFullName': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    };

    const filterCourses = () => {
        return courses.filter(function (course) {
            return course.tutorUID === auth.uid;
        });

    }

    useEffect(() => {
        if (!user.displayName) {
            navigate("/main")
        }

        if (courses) {
            setMyCourses(filterCourses());
        }

    }, [props]);

    const header = () => {
        return (
            <div className="datatable-title">
                <span>Meghirdetett kurzusaim</span>
                <div>
                    <Button label="Új kurzus meghirdetése" icon="pi pi-plus" className="p-button-success mr-2"
                            onClick={() => setShowCourseDialog(true)}/>
                    <Button label="Törlés" icon="pi pi-trash" className="p-button-danger" disabled/>
                </div>
            </div>
        )
    };


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
                <span>{rowData.date}</span>
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

    const editTemplate = (rowData) => {
        return (
            <div className="datatable-button">
                <Button
                    label="Szerkesztés"
                    className="p-button-info"
                    onClick={() => editClickHandler(rowData)}
                    disabled
                />
            </div>
        );
    };

    const editClickHandler = (rowData) => {
        setCurrentRowDataValue(rowData.description);
        setDescriptionDialog(true);
    };

    const hideEditDialog = () => {
        setDescriptionDialog(false);
        setCurrentRowDataValue(null);
    };

    const dialogDescriptionFooter = (
        <React.Fragment>
            <Button
                label="Rendben"
                icon="pi pi-check"
                className="p-button-text"
                onClick={hideEditDialog}/>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <div className="datatable-container">
                <DataTable
                    value={myCourses}
                    loading={!myCourses && !auth.uid}
                    selection={selectedCourses}
                    onSelectionChange={(e) => setSelectedCourses(e.value)}
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
                        selectionMode="multiple"
                        headerStyle={{width: '3rem'}}
                        exportable={false}

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
                        body={limitTemplate}
                        exportable={false}
                        sortable
                        style={{minWidth: '8rem', maxWidth: '8rem', textAlign: 'center'}}
                    />
                    <Column
                        field="startDate"
                        header="Dátum"
                        body={dateTemplate}
                        exportable={false}
                        sortable
                        style={{minWidth: '20rem', maxWidth: '20rem', textAlign: 'center'}}
                    />
                    <Column
                        field="startTime"
                        header="Időpont"
                        body={timeTemplate}
                        exportable={false}
                        sortable
                        style={{minWidth: '20rem', maxWidth: '20rem', textAlign: 'center'}}
                    />
                    <Column
                        body={editTemplate}
                        exportable={false}
                        style={{minWidth: '10rem', maxWidth: '10rem'}}
                    />
                </DataTable>
            </div>

            <div>
                <Dialog
                    visible={descriptionDialog}
                    style={{width: '30em'}}
                    header="Szerkesztés"
                    modal
                    className="p-fluid"
                    footer={dialogDescriptionFooter}
                    onHide={hideEditDialog}
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


                {showCourseDialog
                    ? <Dialog
                        visible={showCourseDialog}
                        style={{width: '40%'}}
                        header="Új kurzus meghirdetése"
                        modal
                        onHide={() => setShowCourseDialog(false)}
                    >
                        <CourseDialog showCourseDialog={showCourseDialog} setShowCourseDialog={setShowCourseDialog}/>
                    </Dialog>
                    : null
                }
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = state => {
    return {
        courses: state.firestore.ordered.courses,
        users: state.firestore.ordered.users,
        auth: state.firebase.auth,
        creationError: state.courses.creationError,
        creationSuccess: state.courses.creationSuccess,
        user: state.user
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
    firestoreConnect([{collection: "courses", orderBy: ["date", "asc"]}]),
    firestoreConnect([{collection: "users"}])
)(MyCourses);