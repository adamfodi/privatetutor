import React, {useRef, useState} from "react";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Rating} from "primereact/rating";

const MyCourses = props => {
    const {courses, auth} = props;
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedCourses, setSelectedCourses] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2"/>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger"/>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Keresés..."/>
            </React.Fragment>
        )
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={6.5} stars="10" readOnly cancel={false} />;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info mr-2"/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mr-2"/>
            </React.Fragment>
        );
    }


    return (
        <div>
            {courses
                ? <div className="datatable-crud-demo">
                    <Toast ref={toast}/>

                    <div className="card">
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>

                        <DataTable ref={dt} value={courses} selection={selectedCourses}
                                   onSelectionChange={(e) => setSelectedCourses(e.value)}
                                   dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                   globalFilter={globalFilter}
                        >
                            <Column selectionMode="multiple" headerStyle={{width: '3rem'}} exportable={false}/>
                            <Column field="subject" header="Tantárgy" sortable style={{minWidth: '5rem'}}/>
                            <Column field="payment" header="Ár(Ft)" sortable style={{minWidth: '3rem'}}/>
                            <Column field="limit" header="Létszám(fő)" sortable style={{minWidth: '3rem'}}/>
                            <Column field="startDate" header="Mettől" sortable style={{minWidth: '12rem'}}/>
                            <Column field="endDate" header="Meddig" sortable style={{minWidth: '12rem'}}/>

                            <Column body={actionBodyTemplate} exportable={false} style={{minWidth: '8rem'}}/>
                        </DataTable>
                    </div>

                </div>
                // : <div> LOADING....... </div> TODO: HA URES ITT KEZELJUK LE IF ELSEVEL REACT FRAGMENTTEL
                : <div> LOADING....... </div>
            }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        courses: state.firestore.ordered.courses,
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "courses", orderBy: ["startDate", "asc"]}])
)(MyCourses);
