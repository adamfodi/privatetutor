import {connect} from "react-redux";
import {Column} from "primereact/column";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {DataTable} from "primereact/datatable";
import {FilterMatchMode} from "primereact/api";
import React, {useCallback, useEffect, useState} from "react";
import "../../assets/css/main.css"
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import CourseDialog from "./CourseDialog";
import {useNavigate} from "react-router-dom";
import {CourseService} from "../../services/CourseService";
import Swal from 'sweetalert2/src/sweetalert2.js'
import '@sweetalert2/theme-dark/';
import moment from "moment";

const MyCourses = props => {
    const {auth, courses} = props;
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState(null);
    const [editableRowData, setEditableRowData] = useState(null);
    const [showCourseDialog, setShowCourseDialog] = useState(false);

    const navigate = useNavigate();
    moment.updateLocale('hu', null);

    const filters = {
        'subject': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'tutorFullName': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    };

    const filterCourses = useCallback(() => {
        return courses.filter(function (course) {
            return course.tutorUID === auth.uid;
        });
    }, [auth.uid, courses])

    useEffect(() => {
        if (!auth.uid) {
            navigate("/main")
        }

        if (courses) {
            setMyCourses(filterCourses());
        }

    }, [auth.uid, courses, filterCourses, navigate]);

    const header = () => {
        return (
            <div className="datatable-title">
                <span>Meghirdetett kurzusaim</span>
                <div>
                    <Button label="Új kurzus meghirdetése" icon="pi pi-plus" className="p-button-success mr-2"
                            onClick={() => setShowCourseDialog(true)}/>
                    <Button label="Törlés" icon="pi pi-trash" className="p-button-danger"
                            disabled={!selectedCourses || selectedCourses.length === 0}
                            onClick={() => deleteClickHandler()}/>
                </div>
            </div>
        )
    };

    const deleteClickHandler = () => {
        Swal.fire({
            title: 'Biztosan törölni szeretné?',
            icon: 'warning',
            iconColor: '#c91e1e',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Igen',
            cancelButtonColor: '#c91e1e',
            cancelButtonText: 'Mégse',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                CourseService.deleteCourses(selectedCourses)
                    .then(() => {
                        setSelectedCourses(null);
                        Swal.fire({
                            position: 'center',
                            confirmButtonColor: '#3085d6',
                            allowOutsideClick: false,
                            icon: 'success',
                            title: 'Sikeres törlés!'
                        })
                    })
                    .catch(() => {
                        Swal.fire({
                            position: 'center',
                            confirmButtonColor: '#3085d6',
                            allowOutsideClick: false,
                            icon: 'error',
                            title: 'Probléma történt!\n Kérem próbálja újra később!'
                        });
                    })
            }
        })

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

    const editTemplate = (rowData) => {
        return (
            <div className="datatable-button">
                <Button
                    label="Szerkesztés"
                    className="p-button-info"
                    onClick={() => {
                        setEditableRowData({...rowData, date: rowData.date.toDate()});
                        setShowCourseDialog(true);
                    }}
                />
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="datatable-container">
                <DataTable
                    value={myCourses}
                    loading={!myCourses && !auth.uid}
                    selection={selectedCourses}
                    onSelectionChange={(e) => setSelectedCourses(e.value)}
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Meghirdetett kurzusaim száma: {totalRecords}"
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
                {showCourseDialog
                    ? <Dialog
                        visible={showCourseDialog}
                        style={{width: '40%'}}
                        header={editableRowData ? "Kurzus szerkesztése" : "Új kurzus meghirdetése"}
                        modal
                        onHide={() => setShowCourseDialog(false)}
                    >
                        <CourseDialog
                            showCourseDialog={showCourseDialog}
                            setShowCourseDialog={setShowCourseDialog}
                            editableRowData={editableRowData}
                            setEditableRowData={setEditableRowData}
                        />
                    </Dialog>
                    : null
                }
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
)(MyCourses);