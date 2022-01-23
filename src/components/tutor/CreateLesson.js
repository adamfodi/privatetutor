import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from 'primereact/button';
import {signUp} from "../../redux/actions/authActions";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {addLocale} from 'primereact/api';
import {InputNumber} from "primereact/inputnumber";
import {InputTextarea} from "primereact/inputtextarea";

const CreateLesson = props => {
    const dateOffset = new Date();
    dateOffset.setHours(dateOffset.getHours() + 1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(dateOffset);
    const [datesCorrect, setDatesCorrect] = useState(true);

    const {authError, auth} = props;
    const navigate = useNavigate();
    const subjectList = ["Matematika", "Fizika", "Kémia", "Biológia", "Történelem", "Informatika"];
    const defaultValues = {
        subject: subjectList[0],
        limit: '1',
        payment: '1000',
        description: '',
        startDate: new Date(),
        endDate: dateOffset
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

    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues});

    useEffect(() => {
        if (!(auth.uid)) {
            navigate("/indexStudent")
        }

    }, [auth, navigate]);

    const onSubmit = (data) => {

        if (startDate <= endDate) {
            setDatesCorrect(true);
            //props.signUp(data);
        } else {
            setDatesCorrect(false);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <p className="card-field-error">{errors[name].message}</p>
    };

    return (
        <div className="form">
            <div className="card">
                <div className="card-name">
                    <h1>Új magánóra létrehozása</h1>
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
                                <Controller name="payment"
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
                                            rules={{required: 'A leírásnak 50 és 1000 karakter közöttinek kell lennie!'}}
                                            render={({field, fieldState}) => (
                                                <InputTextarea id={field.name}
                                                               value={field.value}
                                                               onChange={(e) => field.onChange(e.target.value)}
                                                               rows={10}
                                                               cols={30}
                                                               placeholder="Magánóra leírása..."
                                                               minLength={50}
                                                               maxLength={1000}
                                                               autoResize
                                                />
                                            )}/>
                            </span>
                            {getFormErrorMessage('description')}
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
                        </div>

                        <Button type="submit" label="Meghirdetés" className="card-button"/>
                        {
                            authError
                                ? <p className="card-auth-error">{authError}</p>
                                : null
                        }
                        {
                            !datesCorrect
                                ? <p className="card-auth-error">A dátumok nem megfelelőek!</p>
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
        authError: state.auth.authError,
        auth: state.firebase.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signUp: credentials => dispatch(signUp(credentials))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLesson);
