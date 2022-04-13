import React, {useEffect, useRef, useState} from "react";
import "../../assets/css/dialogs/private-lesson-dialog.css"
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {addLocale} from "primereact/api";
import {addLocaleHu} from "../../util/FormFields";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {PrivateLessonService} from "../../services/PrivateLessonService";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from 'uuid';

const PrivateLessonDialog = (props) => {
    const {firebaseAuth, users, setShowNewPrivateLessonDialog} = props;
    const [usersList, setUsersList] = useState([]);
    const [student, setStudent] = useState(null);
    const [day, setDay] = useState(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0)
        return date;
    });
    const [hourMinuteFrom, setHourMinuteFrom] = useState(() => {
        const date = new Date();
        date.setHours(12, 0, 0, 0)
        return date;
    });
    const [hourMinuteTo, setHourMinuteTo] = useState(() => {
        const date = new Date();
        date.setHours(13, 0, 0, 0)
        return date;
    });
    const errorToast = useRef(null);

    addLocale('hu', addLocaleHu);

    useEffect(() => {
        users && setUsersList(users.map((user) => {
            return {
                nameWithEmail: user.profile.personalData.fullName + ' - ' + user.profile.personalData.email,
                UID: user.id
            }
        }))
    }, [users])

    const validateNewLesson = () => {
        const errorToast = []

        if (!student) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Üres mező',
                detail: 'Hallgató megadása kötelező!'
            })
        }

        if (hourMinuteFrom >= hourMinuteTo) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Hibás időpont',
                detail: 'Érvénytelen időpont!'
            })
        }

        const dateFrom = new Date(day.getTime());
        dateFrom.setHours(hourMinuteFrom.getHours())
        dateFrom.setMinutes(hourMinuteFrom.getMinutes())

        if (dateFrom <= new Date()) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Hibás dátum',
                detail: 'Érvénytelen dátum!'
            })
        }

        return errorToast;
    }

    const onSubmit = () => {
        const toast = validateNewLesson();

        if (toast.length === 0) {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                title: "Létrehozás...",
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            const dateFrom = new Date(day.getTime());
            const dateTo = new Date(day.getTime());

            dateFrom.setHours(hourMinuteFrom.getHours())
            dateFrom.setMinutes(hourMinuteFrom.getMinutes())
            dateTo.setHours(hourMinuteTo.getHours())
            dateTo.setMinutes(hourMinuteTo.getMinutes())

            const privateLesson = {
                studentUID: student.UID,
                tutorUID: firebaseAuth.uid,
                dateFrom: dateFrom,
                dateTo: dateTo,
                status: "pending",
                roomID: uuidv4(),
            }

            console.log(privateLesson)

            PrivateLessonService.createPrivateLesson(privateLesson)
                .then(() => {
                    setShowNewPrivateLessonDialog(false)
                    Swal.fire({
                        didOpen: () => {
                            Swal.hideLoading();
                        },
                        timer: 2000,
                        icon: "success",
                        title: "Sikeres létrehozás!",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    })
                })
                .catch((err) => {
                    setShowNewPrivateLessonDialog(false)
                    console.log(err)
                    Swal.fire({
                        didOpen: () => {
                            Swal.hideLoading();
                        },
                        icon: "error",
                        title: "Probléma történt!\n Kérem próbálja újra később!",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                })
        } else {
            errorToast.current.show(toast);
        }
    }

    return (
        <div className="private-lesson-dialog-content">
            <p className="private-lesson-dialog-content-label-p">Válassz egy hallgatót!</p>
            <Dropdown valueTemplate={student ? student.nameWithEmail : null}
                      options={usersList.filter((user) => user.UID !== firebaseAuth.uid)}
                      onChange={(e) => setStudent(e.value)}
                      optionLabel="nameWithEmail"
                      filter
                      filterBy="nameWithEmail"
                      emptyFilterMessage="Nem található ilyen hallgató."
                      placeholder="Név - Email"
            />
            <div className="private-lesson-dialog-content-date">
                <p className="private-lesson-dialog-content-label-p">Válaszd ki a napot!</p>
                <Calendar
                    value={day}
                    onChange={(e) => setDay(() => {
                        const date = e.target.value;
                        date.setHours(0, 0, 0, 0);
                        return date;
                    })}
                    minDate={new Date()}
                    inline
                    locale="hu"
                />
                <p className="private-lesson-dialog-content-label-p">Válaszd ki az időpontot!</p>
                <div className="private-lesson-dialog-content-date-hour">
                    <div>
                        <span className="private-lesson-dialog-content-label-span">Mettől</span>
                        <Calendar value={hourMinuteFrom}
                                  onChange={(e) => setHourMinuteFrom(e.value)}
                                  timeOnly
                                  inline
                                  hourFormat="24"
                        />
                    </div>
                    <div>
                        <span className="private-lesson-dialog-content-label-span">Meddig</span>
                        <Calendar value={hourMinuteTo}
                                  onChange={(e) => setHourMinuteTo(e.value)}
                                  timeOnly
                                  inline
                                  hourFormat="24"
                        />
                    </div>
                </div>
                <Button label="Létrehozás"
                        onClick={() => onSubmit()}
                />
            </div>
            <Toast ref={errorToast}/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        users: state.firestore.ordered.users,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}])
)(PrivateLessonDialog);