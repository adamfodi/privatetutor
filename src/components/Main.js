import {connect} from "react-redux";
import {Column} from "primereact/column";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {DataTable} from "primereact/datatable";
import {FilterMatchMode} from "primereact/api";
import {useState} from "react";
import {InputText} from "primereact/inputtext";

const Main = props => {
    const {role, courses} = props;

    const [filters, setFilters] = useState({
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'subject': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'limit': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }
    const header = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText value={globalFilterValue}
                               onChange={onGlobalFilterChange}
                               placeholder="Globális keresés..."/>
                </span>
            </div>
        )
    }

    return (
        <div className="datatable-filter">
            <h5>Filter Row</h5>
            <p>Filters are displayed inline within a separate row.</p>
            <DataTable value={courses}
                       loading={!courses}
                       paginator
                       className="p-datatable-courses"
                       rows={10}
                       dataKey="id"
                       filters={filters}
                       filterDisplay="row"
                       responsiveLayout="scroll"
                       globalFilterFields={['subject', 'limit']}
                       header={header}
                       emptyMessage="Nem található óra."
            >
                <Column field="subject"
                        header="Tantárgy"
                        filter
                        showFilterMenu={false}
                        filterPlaceholder="Keresés..."
                        style={{minWidth: '1rem'}}/>
                <Column field="limit"
                        header="Létszám"
                        filter
                        filterPlaceholder="Keresés..."
                        showFilterMenu={false}
                        style={{minWidth: '1rem'}}/>
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