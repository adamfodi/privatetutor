import {connect} from "react-redux";
import {compose} from "redux";
import {FilterMatchMode} from "primereact/api";
import React, {useEffect, useState} from "react";
import "../assets/css/main.css"
import Swal from "sweetalert2";
import {firestoreConnect} from "react-redux-firebase";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Image} from "primereact/image";

const Main = props => {
    const {auth, users} = props;
    const [tutors, setTutors] = useState(null);
    const [tutorsImg, setTutorsImg] = useState(null)

    useEffect(() => {
        console.log("tutors")
        if (users) {
            let tutors = users.filter((user) => user.tutor.advertisement.active === true);

            let tutorsImg = {};
            (async () => {
                console.log(tutors)
                await setTutorsImg(tutorsImg)
                await setTutors(tutors);
            })();
        }
    }, [users]);

    const filters = {
        'subject': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'tutorFullName': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    };

    const header =
        (
            <div className="datatable-title">
                <span>Találd meg a tanárod</span>
            </div>
        )

    const profilePictureTemplate = (rowData) => {
        console.log(tutorsImg ? tutorsImg[rowData.id] : null)
        console.log(rowData)
        return (
            <Image src={tutorsImg ? tutorsImg[rowData.id] : null}
                   alt="Profile Picture"
                   preview
                   downloadable
            />

        )
    };

    console.log(tutors)
    console.log(tutorsImg)
    console.log(tutorsImg ? tutorsImg['LNN9GwcwbXbxqSQFAhVkDmg9yto2'] : null)

    return (
        <React.Fragment>
            <div className="datatable-container">
                <DataTable
                    value={tutors}
                    loading={!tutors || !tutorsImg}
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Összes meghirdetett kurzus száma: {totalRecords}"
                    responsiveLayout="scroll"
                    rows={10}
                    filters={filters}
                    filterDisplay="row"
                    header={header}
                    emptyMessage="Nem található kurzus."
                >
                    <Column
                        body={profilePictureTemplate}
                        exportable={false}
                    />

                </DataTable>
            </div>

            <div>
            </div>
        </React.Fragment>

    )
}


const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users
    };
};

export default compose(
    firestoreConnect([{collection: "users"}]),
    connect(mapStateToProps)
)(Main);