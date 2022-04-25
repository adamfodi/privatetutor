import {connect} from "react-redux";
import {compose} from "redux";
import React, {useEffect, useState} from "react";
import "../assets/css/main.css"
import {firestoreConnect} from "react-redux-firebase";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Image} from "primereact/image";
import {subjectsList} from "../util/FormFields";
import profilePicturePlaceholder from "../assets/img/profile-picture-placeholder.png"
import {Button} from "primereact/button";
import {Chips} from "primereact/chips";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {MultiSelect} from "primereact/multiselect";
import ProfileDialog from "./dialogs/ProfileDialog";
import {Dialog} from "primereact/dialog";

const Main = props => {
    const {users} = props;
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [subjectFilter, setSubjectFilter] = useState(null);
    const [timetableFilter, setTimetableFilter] = useState([]);
    const [lessonsFilter, setLessonsFilter] = useState(null);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [priceFilter, setPriceFilter] = useState(null);
    const [showTutorProfileDialog, setShowTutorProfileDialog] = useState(false);
    const [currentTutorProfileDialog, setCurrentTutorProfileDialog] = useState(null);

    const timetableOptions = [
        {
            label: 'Délelőtt', code: 'DE',
            items: [
                {label: 'Hétfő délelőtt', value: 'morning-monday'},
                {label: 'Kedd délelőtt', value: 'morning-tuesday'},
                {label: 'Szerda délelőtt', value: 'morning-wednesday'},
                {label: 'Csütörtök délelőtt', value: 'morning-thursday'},
                {label: 'Péntek délelőtt', value: 'morning-friday'},
                {label: 'Szombat délelőtt', value: 'morning-saturday'},
                {label: 'Vasárnap délelőtt', value: 'morning-sunday'}
            ]
        },
        {
            label: 'Délután', code: 'DU',
            items: [
                {label: 'Hétfő délután', value: 'afternoon-monday'},
                {label: 'Kedd délután', value: 'afternoon-tuesday'},
                {label: 'Szerda délután', value: 'afternoon-wednesday'},
                {label: 'Csütörtök délután', value: 'afternoon-thursday'},
                {label: 'Péntek délután', value: 'afternoon-friday'},
                {label: 'Szombat délután', value: 'afternoon-saturday'},
                {label: 'Vasárnap délután', value: 'afternoon-sunday'}
            ]
        },
        {
            label: 'Este', code: 'ES',
            items: [
                {label: 'Hétfő este', value: 'evening-monday'},
                {label: 'Kedd este', value: 'evening-tuesday'},
                {label: 'Szerda este', value: 'evening-wednesday'},
                {label: 'Csütörtök este', value: 'evening-thursday'},
                {label: 'Péntek este', value: 'evening-friday'},
                {label: 'Szombat este', value: 'evening-saturday'},
                {label: 'Vasárnap este', value: 'evening-sunday'}
            ]
        }
    ];

    useEffect(() => {
        users && setFilteredTutors(
            users.filter((user) => {
                const filterTutors = () => {
                    // console.log("filterTutors")
                    return user.tutor.advertisement.active
                }

                const filterNames = () => {
                    // console.log("filterNames")
                    return nameFilter.length === 0
                        ? true
                        : user.profile.personalData.fullName.toLowerCase().startsWith(nameFilter.toLowerCase())
                }

                const filterSubjects = () => {
                    // console.log("filterSubjects")
                    return !subjectFilter
                        ? true
                        : user.tutor.advertisement.subjects.some((subject) => subject.name === subjectFilter.name)
                }

                const filterTimetable = () => {
                    const timetable = []
                    user.tutor.advertisement.timetable.forEach((row) => {
                        for (const [key, value] of Object.entries(row)) {
                            if (key !== 'partOfTheDay' && value === 'open') {
                                timetable.push(row.partOfTheDay + '-' + key)
                            }
                        }
                    })
                    return timetableFilter.every((time) => timetable.includes(time))
                }

                return filterTutors() && filterNames() && filterSubjects() && filterTimetable()
            })
        )
    }, [users, nameFilter, subjectFilter, timetableFilter])

    const pictureAndProfileBodyTemplate = (rowData) => {
        return <div>
            <Image
                src={rowData.profile.profilePictureUrl ? rowData.profile.profilePictureUrl : profilePicturePlaceholder}
                alt={rowData.profile.personalData.fullName + ' profile picture'}
                preview
            />
            <Button label="Profil"
                    onClick={() => {
                        setCurrentTutorProfileDialog(rowData);
                        setShowTutorProfileDialog(true);
                    }}
            />
        </div>
    }

    const nameAndSubjectsBodyTemplate = (rowData) => {
        return <div>
            <p>{rowData.profile.personalData.fullName}</p>
            <p>Oktatott tárgyak:</p>
            <Chips
                value={rowData.tutor.advertisement.subjects.map((subject) => subject.name)}
                removable={false}
                readOnly
            />
        </div>
    }

    const hoursHeldBodyTemplate = (rowData) => {
        return <div>
            <p>{rowData.tutor.hoursHeld}</p>
        </div>
    }

    const ratingBodyTemplate = (rowData) => {
        const rating = rowData.profile.feedback.length === 0 ? 0 : 4.5;
        return <div>
            <p>{rating}</p>
        </div>
    }

    const hourlyRateBodyTemplate = (rowData) => {
        return <div>
            <p>{rowData.tutor.advertisement.hourlyRate}</p>
            <p>Ft/óra</p>
        </div>
    }

    return (
        <div className="main-container">
            <div className="datatable-container">
                <DataTable
                    value={filteredTutors}
                    loading={!users}
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Találatok száma: {totalRecords}"
                    responsiveLayout="scroll"
                    rows={5}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    sortField="tutor.advertisement.hourlyRate"
                    sortOrder={1}
                    emptyMessage="Nem található tanár."
                >

                    <Column
                        body={pictureAndProfileBodyTemplate}
                        className="picture-and-profile-template-td"
                    />

                    <Column
                        field="profile.personalData.fullName"
                        header="Név"
                        sortable
                        body={nameAndSubjectsBodyTemplate}
                        className="name-and-subjects-body-template-td"

                    />

                    <Column
                        field="tutor.hoursHeld"
                        header="Megtartott órák"
                        sortable
                        body={hoursHeldBodyTemplate}
                        className="hours-held-body-template-td"
                    />

                    <Column
                        header="Értékelés"
                        sortable
                        body={ratingBodyTemplate}
                        className="rating-body-template-td"

                    />

                    <Column
                        field="tutor.advertisement.hourlyRate"
                        header="Óradíj"
                        sortable
                        body={hourlyRateBodyTemplate}
                        className="hourly-rate-body-template-td"

                    />
                </DataTable>
            </div>
            <div className="filter-container">
                <div className="header-div">
                    <p>Szűrés</p>
                </div>
                <div className="name-div">
                    <p>Név</p>
                    <InputText value={nameFilter}
                               onChange={(e) => setNameFilter(e.target.value)}
                               placeholder="pl. Kovács István"
                    />
                </div>
                <div className="subjects-div">
                    <p>Tantárgy</p>
                    <Dropdown value={subjectFilter}
                              options={subjectsList}
                              onChange={(e) => setSubjectFilter(e.value)}
                              optionLabel="name"
                              filter
                              filterMatchMode="startsWith"
                              showClear
                              filterBy="name"
                              placeholder="pl. Matematika"
                              emptyFilterMessage="Nem található ilyen tárgynév"
                    />

                </div>
                <div className="timetable-div">
                    <p>Időpont</p>
                    <MultiSelect
                        value={timetableFilter}
                        options={timetableOptions}
                        onChange={(e) => setTimetableFilter(e.value)}
                        optionLabel="label"
                        optionValue="value"
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        placeholder="pl.: Kedd délután"
                        display="chip"
                    />
                </div>
                <div className="clear-div">
                    <Button label="Szűrés törlése"
                            className="p-button-danger p-button-text"
                            onClick={() => {
                                setNameFilter('')
                                setSubjectFilter(null)
                                setTimetableFilter([])
                            }}
                    />
                </div>
            </div>
            <Dialog header="Profil"
                    visible={showTutorProfileDialog}
                    position={"center"}
                    modal
                    onHide={() => setShowTutorProfileDialog(false)}
                    draggable={false}
                    resizable={false}
                    className="profile-dialog"
            >
                <ProfileDialog
                    data={currentTutorProfileDialog}
                />
            </Dialog>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        users: state.firestore.ordered.users
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}])
)(Main);