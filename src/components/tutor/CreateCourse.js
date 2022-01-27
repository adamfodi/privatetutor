import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from 'primereact/button';
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {addLocale} from 'primereact/api';
import {InputNumber} from "primereact/inputnumber";
import {InputTextarea} from "primereact/inputtextarea";
import {clearCourses, createCourse} from "../../redux/actions/courseActions";
import moment from "moment";

const CreateCourse = props => {
    const {auth, role, displayName, error, success} = props;
    const navigate = useNavigate();

    const dateOffset = new Date();
    dateOffset.setHours(dateOffset.getHours() + 1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(dateOffset);
    const [descriptionLength, setDescriptionLength] = useState(0);

    const subjectList = ["Matematika", "Fizika", "Kémia", "Biológia", "Történelem", "Informatika"];
    const defaultValues = {
        subject: subjectList[0],
        price: '1000',
        limit: '1',
        startDate: new Date(),
        endDate: dateOffset,
        applicants: [],
        description: '',
        tutorUID: auth.uid,
        tutorFullName: displayName
    };

    addLocale('hu', {
        firstDayOfWeek: 1,
        dayNames: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"],
        dayNamesShort: ["Vasá", "Hétf", "Kedd", "Szer", "Csüt", "Pént", "Szom"],
        dayNamesMin: ["Va", "Hé", "Ke", "Sz", "Cs", "Pé", "Sz"],
        monthNames: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sze", "Okt", "Nov", "Dec"],
        today: 'Ma',
        clear: 'Tisztítás',
        weekHeader: 'Hét'
    });

    const {control, handleSubmit} = useForm({defaultValues});

    useEffect(() => {
        if (role !== 'tutor' || !auth.uid) {
            navigate("/main")
        }

        if (success) {
            navigate("/createdcourses")
        }

        return () => {
            props.clearCourses();
        }

    }, [auth, navigate, role, success, props]);

    const onSubmit = (data) => {

        if (startDate < endDate && descriptionLength >= 50 && descriptionLength <= 1000) {
            console.log(data)
            console.log(defaultValues.tutorUID)
            props.createCourse(
                {
                    ...data,
                    startDate: moment(data.startDate).format('YYYY.MM.DD HH:mm').toString(),
                    endDate: moment(data.endDate).format('YYYY.MM.DD HH:mm').toString(),
                });
        }
    };

    return (
        <React.Fragment>
            ? <div className="form">
            <div className="card">
                <div className="card-name">
                    <h1>Új kurzus létrehozása</h1>
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
                            <p className="card-field-name">Mettől</p>
                            <span className="p-float-label">
                                <Controller name="startDate"
                                            control={control}
                                            render={({field}) => (
                                                <Calendar
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        setStartDate(e.value);
                                                        field.onChange(e.target.value)
                                                    }}
                                                    dateFormat="yy/mm/dd"
                                                    minDate={new Date()}
                                                    locale="hu"
                                                    showTime
                                                    showIcon
                                                />
                                            )}/>
                            </span>
                        </div>

                        <div className="card-field">
                            <p className="card-field-name">Meddig</p>
                            <span className="p-float-label">
                                <Controller name="endDate"
                                            control={control}
                                            render={({field}) => (
                                                <Calendar
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        setEndDate(e.value);
                                                        field.onChange(e.target.value)
                                                    }}
                                                    dateFormat="yy/mm/dd"
                                                    minDate={startDate}
                                                    locale="hu"
                                                    showTime
                                                    showIcon
                                                />
                                            )}/>
                            </span>
                            {startDate >= endDate
                                ? <p className="card-field-error">A dátumok nem megfelelőek!</p>
                                : null
                            }
                        </div>

                        <Button type="submit" label="Meghirdetés" className="card-button"/>
                        {
                            error
                                ? <p className="card-auth-error">Probléma merült fel! Kérem próbálja újra
                                    később!</p>
                                : null
                        }
                    </form>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        displayName: state.user.displayName,
        role: state.user.role,
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateCourse);

