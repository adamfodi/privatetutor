import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from 'primereact/button';
import {connect} from "react-redux";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {addLocale} from 'primereact/api';
import {InputNumber} from "primereact/inputnumber";
import {InputTextarea} from "primereact/inputtextarea";
import moment from "moment";
import 'moment/locale/hu';
import "../../assets/css/courseDialog.css"
import {InputText} from "primereact/inputtext";
import {CourseService} from "../../services/CourseService";
import Swal from 'sweetalert2/src/sweetalert2.js'
import '@sweetalert2/theme-dark/';
import {addLocaleHu} from "../../util/CalendarHu";
import {subjectList} from "../../util/SubjectList";

const CourseDialog = props => {
    const {auth, profile} = props;
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [startTime, setStartTime] = useState('14:00');
    const [endTime, setEndTime] = useState('15:00');

    const defaultValues = {
        subject: subjectList[0],
        price: '1000',
        limit: '1',
        date: new Date(),
        startTime: null,
        endTime: null,
        applicants: [],
        description: '',
        tutorUID: auth.uid,
        tutorFullName: profile.fullName
    };

    moment.locale('hu');
    addLocale('hu', addLocaleHu);

    const {control, handleSubmit} = useForm({defaultValues});

    const onSubmit = (data) => {

        if (descriptionLength >= 50 && descriptionLength <= 1000) {
            CourseService.createCourse(
                {
                    ...data,
                    date: moment(data.date).format('YYYY.MM.DD').toString(),
                    startTime: startTime,
                    endTime: endTime
                })
                .then(() => {
                    Swal.fire({
                        position: 'center',
                        confirmButtonColor: '#3085d6',
                        allowOutsideClick: false,
                        icon: 'success',
                        title: 'Sikeres kurzus létrehozás!'
                    }).then(
                        props.setShowCourseDialog(false)
                    )
                })
                .catch(() => {
                    Swal.fire({
                        position: 'center',
                        confirmButtonColor: '#3085d6',
                        allowOutsideClick: false,
                        icon: 'error',
                        iconColor: '#c91e1e',
                        title: 'Probléma történt!\n Kérem próbálja újra később!'
                    });
                })
        }
    }

    return (
        <div className="courseDialogForm">
            <div className="card">
                <div className="card-name">
                    <h1>Új kurzus</h1>
                </div>

                <div className="card-content">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="card-field">
                            <p className="card-field-name">Tantárgy</p>
                            <span className="p-float-label" style={{textAlign: "left"}}>
                                <Controller name="subject"
                                            control={control}
                                            render={({field}) => (
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    options={subjectList}
                                                />
                                            )}/>
                            </span>
                        </div>

                        <div className="card-field">
                            <p className="card-field-name">Létszám</p>
                            <span className="p-float-label">
                                <Controller name="limit"
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <InputNumber id={field.name}
                                                             value={field.value}
                                                             onValueChange={(e) => field.onChange(e.value)}
                                                             showButtons
                                                             step={1}
                                                             suffix=" fő"
                                                             min={1}
                                                             max={10}
                                                />
                                            )}/>
                            </span>
                        </div>

                        <div className="card-field">
                            <span className="p-float-label">
                                <p className="card-field-name">Ár</p>
                                <Controller name="price"
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <InputNumber id={field.name}
                                                             value={field.value}
                                                             onValueChange={(e) => field.onChange(e.value)}
                                                             showButtons
                                                             step={500}
                                                             suffix=" Ft / fő"
                                                             min={0}
                                                             max={100000}
                                                />
                                            )}/>
                            </span>
                        </div>

                        <div className="card-field">
                            <p className="card-field-name">Leírás</p>
                            <span className="p-float-label">
                                <Controller name="description"
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <InputTextarea id={field.name}
                                                               value={field.value}
                                                               onChange={(e) => {
                                                                   setDescriptionLength(e.target.value.length);
                                                                   field.onChange(e.target.value)
                                                               }}
                                                               rows={10}
                                                               cols={30}
                                                               placeholder="Magánóra leírása..."
                                                               autoResize
                                                />
                                            )}/>
                            </span>
                            {descriptionLength < 50 || descriptionLength > 1000
                                ? <p className="card-field-error">A leírásnak 50 és 1000 karakter között kell
                                    lennie! ({descriptionLength})</p>
                                : null
                            }
                        </div>

                        <div className="card-field">
                            <p className="card-field-name">Dátum</p>
                            <span className="p-float-label">
                                <Controller name="date"
                                            control={control}
                                            render={({field}) => (
                                                <Calendar
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value)
                                                    }}
                                                    dateFormat="yy/mm/dd - DD"
                                                    minDate={new Date()}
                                                    locale="hu"
                                                    showIcon
                                                    selectOtherMonths
                                                    required
                                                />
                                            )}/>
                            </span>
                        </div>

                        <div className="card-field-container">

                            <div className="card-field">
                                <p className="card-field-name">Mettől</p>
                                <span className="p-float-label">
                                    <Controller name="startTime"
                                                control={control}
                                                render={({field}) => (
                                                    <InputText
                                                        id={field.name}
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                        pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                                                        required
                                                    />
                                                )}/>
                                </span>
                            </div>

                            <div className="card-field">
                                <p className="card-field-name">Meddig</p>
                                <span className="p-float-label">
                                    <Controller name="endTime"
                                                control={control}
                                                render={({field}) => (
                                                    <InputText
                                                        id={field.name}
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                        pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                                                        required
                                                    />
                                                )}/>
                                </span>
                            </div>
                        </div>
                        {startTime >= endTime
                            ? <p style={{textAlign: "center"}} className="card-field-error">
                                Az időintervallum nem megfelelő!
                            </p>
                            : null
                        }

                        <Button type="submit" label="Meghirdetés" className="card-button"/>
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
    };
};

export default connect(mapStateToProps)(CourseDialog);

