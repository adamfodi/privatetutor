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
import lessonsPicture from "../assets/img/lessons.png"
import ratingPicture from "../assets/img/star.png"
import pricePicture from "../assets/img/money.png"
import {Button} from "primereact/button";
import {Chips} from "primereact/chips";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Badge} from "primereact/badge";
import {MultiSelect} from "primereact/multiselect";
import TutorProfileDialog from "./dialogs/TutorProfileDialog";
import {Dialog} from "primereact/dialog";

const Main = props => {
    const {auth, users} = props;
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [subjectFilter, setSubjectFilter] = useState(null);
    const [timetableFilter, setTimetableFilter] = useState([]);
    const [lessonsFilter, setLessonsFilter] = useState(null);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [priceFilter, setPriceFilter] = useState(null);
    const [showTutorProfileDialog, setShowTutorProfileDialog] = useState(false);
    const [currentTutorProfileDialog, setCurrentTutorProfileDialog] = useState(null);

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
            <Button label="Profil megtekintése"
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
            <p>Tanított tárgyak:</p>
            <Chips value={rowData.tutor.advertisement.subjects.map((subject) => subject.name)}
                   removable={false}
                   readOnly

            />
        </div>
    }

    const lessonsBodyTemplate = (rowData) => {
        return <div>
            <div>
                <Image src={lessonsPicture}/>
            </div>
            <Badge value={15}/>
        </div>
    }

    const ratingBodyTemplate = (rowData) => {
        return <div>
            <div>
                <Image src={ratingPicture}/>
            </div>
            <Badge value={4.2}/>
        </div>
    }

    const hourlyRateBodyTemplate = (rowData) => {
        return <div>
            <div>
                <Image src={pricePicture}/>
            </div>
            <Badge value={"5000 Ft / óra"}/>
        </div>
    }

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

    return (
        <div className="main-container">
            <div className="datatable-container">
                <DataTable
                    value={filteredTutors}
                    loading={!users}
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Találatok száma: {totalRecords}"
                    responsiveLayout="scroll"
                    rows={5}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    // header={header}
                    emptyMessage="Nem található tanár."
                >

                    <Column body={pictureAndProfileBodyTemplate}
                            className="picture-and-profile-template-td"

                    />

                    <Column field="profile.personalData.fullName"
                            header="Név"
                            sortable
                            body={nameAndSubjectsBodyTemplate}
                            className="name-and-subjects-body-template-td"

                    />

                    <Column header="Megtartott órák"
                            sortable
                            body={lessonsBodyTemplate}
                            className="lessons-body-template-td"
                    />

                    <Column header="Értékelés"
                            sortable
                            body={ratingBodyTemplate}
                            className="rating-body-template-td"

                    />

                    <Column header="Óradíj"
                            sortable
                            body={hourlyRateBodyTemplate}
                            className="hourly-rate-body-template-td"

                    />

                </DataTable>
            </div>
            <div className="filter-container">
                <div className="filter-container-header">
                    <p>Szűrés</p>
                    <Button label="Szűrés törlése"
                            className="p-button-danger p-button-text"
                            onClick={() => {
                                setNameFilter('')
                                setSubjectFilter(null)
                            }}
                    />
                </div>
                <div className="filter-container-name">
                    <p>Név</p>
                    <InputText value={nameFilter}
                               onChange={(e) => setNameFilter(e.target.value)}
                               placeholder="pl. Kovács István"
                    />
                </div>
                <div className="filter-container-subjects">
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
                <div className="filter-container-timetable">
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
            </div>
            <Dialog header="Oktatói profil"
                    visible={showTutorProfileDialog}
                    position={"bottom"}
                    modal
                    onHide={() => setShowTutorProfileDialog(false)}
                    resizable={false}
                    className="tutor-profile-dialog"
            >
                <TutorProfileDialog data={currentTutorProfileDialog}/>
            </Dialog>
        </div>

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