import {connect} from "react-redux";
import {compose} from "redux";
import React, {useEffect, useState} from "react";
import {firestoreConnect} from "react-redux-firebase";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import TutorProfileDialog from "../dialogs/TutorProfileDialog";
import NewPrivateLessonDialog from "../dialogs/NewPrivateLessonDialog";

const PrivateLessons = props => {
    const {auth, privateLessons} = props;
    const [myPrivateLessons, setMyPrivateLessons] = useState([]);
    const [showNewPrivateLessonDialog, setShowNewPrivateLessonDialog] = useState(false);

    useEffect(() => {
        if (auth.uid && privateLessons) {
            setMyPrivateLessons(privateLessons.map((privateLesson) => privateLesson.tutor === auth.uid && privateLesson))
        }
    }, [auth.uid, privateLessons])

    const headerTemplate = (
        <div>
            <Button label="Új magánóra meghirdetése"
                    onClick={() => setShowNewPrivateLessonDialog(true)}
            />
        </div>
    )


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
                    header={headerTemplate}
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
            <Dialog header="Új magánóra létrehozása"
                    visible={showNewPrivateLessonDialog}
                    modal
                    onHide={() => setShowNewPrivateLessonDialog(false)}
                    resizable={false}
                    className="new-private-lesson-dialog"
            >
                <NewPrivateLessonDialog setShowNewPrivateLessonDialog={setShowNewPrivateLessonDialog}/>
            </Dialog>
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