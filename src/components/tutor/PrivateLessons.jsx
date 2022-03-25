import {connect} from "react-redux";
import {compose} from "redux";
import React, {useEffect, useState} from "react";
import {firestoreConnect} from "react-redux-firebase";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

const PrivateLessons = props => {
    const {auth, privateLessons} = props;
    const [myPrivateLessons, setMyPrivateLessons] = useState([]);

    useEffect(() => {
        auth.uid && privateLessons &&
        setMyPrivateLessons(privateLessons.map((privateLesson) => privateLesson.tutor === auth.uid && privateLesson))
    }, [auth.uid, privateLessons])


    return (
        <div className="private-lessons-container">
            <div className="datatable-container">
                <DataTable
                    value={myPrivateLessons}
                    loading={!myPrivateLessons}
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Találatok száma: {totalRecords}"
                    responsiveLayout="scroll"
                    rows={5}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    // header={header}
                    emptyMessage="Nem található magánóra."
                >
                    <Column field="student"
                            header="Hallgató"
                    />

                    <Column field="tutor"
                            header="Oktató"
                    />

                    {/*<Column field="date"*/}
                    {/*/>*/}

                    <Column field="status"
                            header="Állapot"
                    />

                </DataTable>
            </div>
        </div>

    )
}


const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        privateLessons: state.firestore.ordered.privateLessons
    };
};

export default compose(
    firestoreConnect([{collection: "privateLessons"}]),
    connect(mapStateToProps)
)(PrivateLessons);