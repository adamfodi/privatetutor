import {addLocale} from "primereact/api";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import "../../assets/css/profile/personal-data.css"
import "../../assets/css/util/calendar.css"
import {addLocaleHu, genderList} from "../../util/FormFields";
import Swal from "sweetalert2";
import {Button} from "primereact/button";
import {UserService} from "../../services/UserService";
import React, {useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {InputNumber} from "primereact/inputnumber";
import {connect} from "react-redux";

const PersonalData = (props) => {
    const {firebaseAuth, personalData} = props;
    const [lastName, setLastName] = useState(personalData.lastName);
    const [firstName, setFirstName] = useState(personalData.firstName);
    const [birthday, setBirthday] = useState(personalData.birthday);
    const [gender, setGender] = useState(personalData.gender);
    const [phoneNumber, setPhoneNumber] = useState(personalData.phoneNumber);
    const [city, setCity] = useState(personalData.city);
    const errorToast = useRef(null);

    addLocale('hu', addLocaleHu);

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value}
                         options={e.options}
                         onChange={(event) => e.onChange(event.originalEvent, event.value)}
                         className="ml-2"
                         style={{lineHeight: 1}}
        />
    };

    const validatePersonalData = () => {
        const errorToast = []

        if (lastName.length === 0) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Vezetéknév megadása kötelező!',
            })
        }
        if (firstName.length === 0) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Keresztnév megadása kötelező!',
            })
        }

        if (!birthday) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Születésnap megadása kötelező!',
            })
        }

        if (phoneNumber) {
            let pattern = new RegExp("^\\d{9}$");
            if (!pattern.test(phoneNumber)) {
                errorToast.push({
                    life: 5000,
                    severity: 'error',
                    summary: 'Nem megfelelő telefonszám formátum!',
                })
            }
        }

        if (city && city.length > 40) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'A lakhely maximum 40 karakter hosszú lehet!',
            })
        }

        return errorToast;

    }

    const updatePersonalData = () => {
        const toast = validatePersonalData();

        if (toast.length === 0) {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                title: "Módosítás...",
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            const newPersonalData = {
                email: personalData.email,
                firstName: firstName,
                lastName: lastName,
                fullName: lastName + ' ' + firstName,
                birthday: birthday,
                gender: gender,
                phoneNumber: phoneNumber,
                city: city
            }

            UserService.updatePersonalData(firebaseAuth.uid, newPersonalData)
                .then(() => {
                    Swal.fire({
                        timer: 1500,
                        icon: "success",
                        title: "Sikeres módosítás!",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    })
                })
                .catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Hiba történt az adatok módosítása során!\n Kérem próbálja újra később!",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                })
        } else {
            errorToast.current.show(toast);
        }
    };

    return (
        <>
            <div className="personal-data-fields-container">
                <div className="personal-data-field">
                    <p>
                        Vezetéknév*
                    </p>
                    <InputText
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="personal-data-field">
                    <p>
                        Keresztnév*
                    </p>
                    <InputText
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="personal-data-field">
                    <p>
                        Születésnap*
                    </p>
                    <Calendar
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        dateFormat="yy.mm.dd"
                        maxDate={new Date()}
                        yearNavigator
                        yearNavigatorTemplate={yearNavigatorTemplate}
                        yearRange="1900:2022"
                        selectOtherMonths
                        locale="hu"
                    />
                </div>
                <div className="personal-data-field">
                    <p>
                        Nem*
                    </p>
                    <Dropdown
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        options={genderList}
                    />
                </div>
                <div className="personal-data-field">
                    <p>
                        Telefonszám
                    </p>
                    <InputNumber
                        value={phoneNumber}
                        onValueChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+36 301234567"
                        prefix="+36 "
                        useGrouping={false}
                        tooltip="pl. +36 301234567"
                    />
                </div>
                <div className="personal-data-field">
                    <p>
                        Lakhely
                    </p>
                    <InputText
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
            </div>
            <div className="personal-data-button-container">
                <Button
                    label="Módosítások mentése"
                    className="personal-data-submit-button"
                    onClick={() => updatePersonalData()}
                />
            </div>
            <Toast ref={errorToast}/>
        </>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth
    };
};

export default connect(mapStateToProps)(PersonalData)