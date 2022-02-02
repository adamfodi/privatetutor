import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from 'primereact/button';
import {connect} from "react-redux";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {addLocale} from 'primereact/api';
import {InputNumber} from "primereact/inputnumber";
import {InputTextarea} from "primereact/inputtextarea";
import {clearCourses, createCourse} from "../../redux/actions/courseActions";
import moment from "moment";
import 'moment/locale/hu';
import "../../assets/css/courseDialog.css"
import {InputText} from "primereact/inputtext";

const CourseDialog = props => {
    const {auth, displayName, success, error} = props;
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [startTime, setStartTime] = useState('14:00');
    const [endTime, setEndTime] = useState('15:00');

    useEffect(() => {
        if (success) {
            props.setShowCourseDialog(false);
        }
        return () => {
            props.clearCourses();
        }

    }, [props]);

    moment.locale('hu');

    const subjectList = ["Matematika", "Fizika", "Kémia", "Biológia", "Történelem", "Informatika"];
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
        tutorFullName: displayName
    };

    addLocale('hu', {
        firstDayOfWeek: 1,
        dayNames: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
        dayNamesShort: ["Vasá", "Hétf", "Kedd", "Szer", "Csüt", "Pént", "Szom"],
        dayNamesMin: ["Va", "Hé", "Ke", "Sz", "Cs", "Pé", "Sz"],
        monthNames: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sze", "Okt", "Nov", "Dec"],
        today: 'Ma',
        clear: 'Tisztítás',
        weekHeader: 'Hét'
    });

    const {control, handleSubmit} = useForm({defaultValues});

    const onSubmit = (data) => {

        if (descriptionLength >= 50 && descriptionLength <= 1000) {
            props.createCourse(
                {
                    ...data,
                    date: moment(data.date).format('YYYY.MM.DD').toString(),
                    startTime: startTime,
                    endTime: endTime
                });
        }
    };

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
                            ? <p style={{textAlign: "center"}} className="card-field-error">Az időintervallum nem
                                megfelelő!</p>
                            : null
                        }

                        <Button type="submit" label="Meghirdetés" className="card-button"/>
                        {
                            error
                                ? <p className="card-auth-error">
                                    Probléma merült fel! Kérem próbálja újra később!
                                </p>
                                : null
                        }
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        displayName: state.user.displayName,
        error: state.courses.creationError,
        success: state.courses.creationSuccess,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createCourse: course => dispatch(createCourse(course)),
        clearCourses: () => dispatch(clearCourses())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDialog);

