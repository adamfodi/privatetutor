import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Password} from 'primereact/password';
import {classNames} from 'primereact/utils';
import {clearAuth, signUp} from "../../redux/actions/authActions";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {addLocale} from 'primereact/api';

const SignUp = props => {
    const {signUpError, signUpSuccess, auth} = props;
    const navigate = useNavigate();
    const genderList = ["Férfi", "Nő", "Egyéb"];
    const [passwordsAreIdentical, setPasswordsAreIdentical] = useState(true);
    const defaultValues = {
        email: '',
        password: '',
        password2: '',
        lastname: '',
        firstname: '',
        fullname: '',
        birthday: null,
        gender: genderList[0]
    };
    const emailError = "Firebase: The email address is already in use by another account. (auth/email-already-in-use).";

    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues});

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

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="ml-2" style={{ lineHeight: 1 }} />;
    }

    useEffect(() => {
        if (!(auth.isLoaded && auth.isEmpty)) {
            navigate("/main")
        }

        if (signUpSuccess) {
            navigate("/signin")
        }

        return () => {
            props.clearAuth();
        }

    }, [auth, navigate, props, passwordsAreIdentical, signUpSuccess]);

    const onSubmit = (data) => {

        if (data.password === data.password2) {
            console.log(data)
            setPasswordsAreIdentical(true);
            props.signUp({...data, fullname: data.lastname + ' ' + data.firstname});
        } else {
            setPasswordsAreIdentical(false);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <p className="card-field-error">{errors[name].message}</p>
    };

    return (
        <div className="form">
            <div className="card">
                <div className="card-name">
                    <h1>Regisztráció</h1>
                </div>

                <div className="card-content">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="card-field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope"/>
                                <Controller name="email"
                                            control={control}
                                            rules={{
                                                required: 'Email cím megadása kötelező!',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                    message: 'Helytelen email cím!'
                                                }
                                            }}
                                            render={({field, fieldState}) => (
                                                <InputText id={field.name}
                                                           {...field}
                                                           className={classNames({'p-invalid': fieldState.invalid})}
                                                />
                                            )}/>
                                <label htmlFor="email"
                                       className={classNames({'p-error': !!errors.email})}>Email*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>

                        <div className="card-field">
                            <span className="p-float-label">
                                <Controller name="password"
                                            control={control}
                                            rules={{required: 'Jelszó megadása kötelező!'}}
                                            render={({field, fieldState}) => (
                                                <Password id={field.name} {...field} toggleMask
                                                          feedback
                                                          promptLabel="Írjon be egy jelszót"
                                                          weakLabel="Gyenge"
                                                          mediumLabel="Közepes"
                                                          strongLabel="Erős"
                                                          minLength={6}
                                                          className={classNames({'p-invalid': fieldState.invalid})}
                                                />
                                            )}/>
                                <label htmlFor="password"
                                       className={classNames({'p-error': errors.password})}>Jelszó*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>

                        <div className="card-field">
                            <span className="p-float-label">
                                <Controller name="password2"
                                            control={control}
                                            rules={{required: 'Ismételt jelszó megadása kötelező!'}}
                                            render={({field, fieldState}) => (
                                                <Password id={field.name} {...field} toggleMask
                                                          feedback={false}
                                                          minLength={6}
                                                          className={classNames({'p-invalid': fieldState.invalid})}
                                                />
                                            )}/>
                                <label htmlFor="password2"
                                       className={classNames({'p-error': errors.password2})}>Jelszó újra*</label>
                            </span>
                            {getFormErrorMessage('password2')}
                        </div>

                        <div className="card-field">
                            <span className="p-float-label">
                                <Controller name="lastname"
                                            control={control}
                                            rules={{
                                                required: 'Vezetéknév megadása kötelező!'
                                            }}
                                            render={({field, fieldState}) => (
                                                <InputText id={field.name}
                                                           {...field}
                                                           className={classNames({'p-invalid': fieldState.invalid})}
                                                />
                                            )}/>
                                <label htmlFor="lastname"
                                       className={classNames({'p-error': !!errors.lastname})}>Vezetéknév*</label>
                            </span>
                            {getFormErrorMessage('lastname')}
                        </div>

                        <div className="card-field">
                            <span className="p-float-label">
                                <Controller name="firstname"
                                            control={control}
                                            rules={{
                                                required: 'Keresztnév megadása kötelező!'
                                            }}
                                            render={({field, fieldState}) => (
                                                <InputText id={field.name}
                                                           {...field}
                                                           className={classNames({'p-invalid': fieldState.invalid})}
                                                />
                                            )}/>
                                <label htmlFor="firstname"
                                       className={classNames({'p-error': !!errors.lastname})}>Keresztnév*</label>
                            </span>
                            {getFormErrorMessage('firstname')}
                        </div>

                        <div className="card-field">
                            <span className="p-float-label">
                                <Controller name="birthday"
                                            control={control}
                                            rules={{
                                                required: 'Születésnap megadása kötelező!'
                                            }}
                                            render={({field}) => (
                                                <Calendar
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    dateFormat="yy/mm/dd"
                                                    maxDate={new Date()}
                                                    yearNavigator
                                                    yearNavigatorTemplate={yearNavigatorTemplate}
                                                    yearRange="1900:2022"
                                                    selectOtherMonths
                                                    locale="hu"
                                                    showIcon
                                                />
                                            )}/>
                                <label htmlFor="birthday"
                                       className={classNames({'p-error': !!errors.birthday})}>Születésnap*</label>
                            </span>
                            {getFormErrorMessage('birthday')}
                        </div>

                        <div className="card-field">
                            <span className="p-float-label" style={{textAlign: "left"}}>
                                <Controller name="gender"
                                            control={control}
                                            render={({field}) => (
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    options={genderList}
                                                />
                                            )}/>
                            </span>
                        </div>

                        <Button type="submit" label="Regisztráció" className="card-button"/>
                        {
                            !passwordsAreIdentical
                                ? <p className="card-auth-error">A jelszavak nem egyeznek meg!</p>
                                : null
                        }
                        {
                            signUpError
                                ? <p className="card-auth-error">Sikertelen regisztráció!</p>
                                : null
                        }
                        {
                            signUpError === emailError
                                ? <p className="card-auth-error">Az adott email cím már foglalt!</p>
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
        signUpError: state.auth.signUpError,
        signUpSuccess: state.auth.signUpSuccess,
        auth: state.firebase.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signUp: credentials => dispatch(signUp(credentials)),
        clearAuth: () => dispatch(clearAuth())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
