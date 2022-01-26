import {connect} from "react-redux";
import {Column} from "primereact/column";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {DataTable} from "primereact/datatable";
import {FilterMatchMode} from "primereact/api";
import React from "react";
import "../assets/css/DataTableFilter.css"
import {Button} from "primereact/button";

const Main = props => {
    const {auth, role, courses} = props;

    const filters = {
        'subject': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'tutorFullName': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    };

    console.log(role)

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

        if (rowData.applicants) {
            if (rowData.applicants.length === rowData.limit) {
                return (
                    <div className="datatable-button">
                        <Button style={{opacity: '1'}} label="Betelt" className="p-button-danger" disabled/>
                    </div>
                )
            } else {
                return (
                    <div className="datatable-button">
                        <Button label="Jelentkezés" className="p-button-success"/>
                    </div>
                )
            }

        }

        return null;

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
                <span className="datatable-tutor">{rowData.tutorFullName}</span>
            </p>
        );
    };

    const description = (rowData) => {
        return (
            <p className="datatable-button">
                <Button label="Megtekintés" className="p-button-info"/>
            </p>
        );
    };

    return (
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
                    field="limit"
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
    )

}

const mapStateToProps = state => {
    return {
        courses: state.firestore.ordered.courses,
        auth: state.firebase.auth,
        role: state.user.role
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "courses", orderBy: ["startDate", "asc"]}])
)(Main);