import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Password} from 'primereact/password';
import {classNames} from 'primereact/utils';
import '../../assets/css/auth.css';
import {signUp} from "../../redux/actions/authActions";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";

const SignUp = props => {
    const {authError, auth} = props;
    const navigate = useNavigate();
    const genderList = ["Férfi", "Nő", "Egyéb"];
    const [passwordsAreIdentical, setPasswordsAreIdentical] = useState(true);
    const defaultValues = {
        email: '',
        password: '',
        password2: '',
        lastname: '',
        firstname: '',
        birthday: null,
        gender: genderList[0]
    };
    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues});

    useEffect(() => {
        if (!(auth.isLoaded && auth.isEmpty)) {
            navigate("/indexStudent")
        }

    }, [auth, navigate]);
    const onSubmit = (data) => {

        if (data.password === data.password2) {
            console.log(data)
            setPasswordsAreIdentical(true);
            props.signUp(data);
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
                                                <InputText id={field.name} {...field}
                                                           className={classNames({'p-invalid': fieldState.invalid})}/>
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
                                                          className={classNames({'p-invalid': fieldState.invalid})}/>
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
                                                          className={classNames({'p-invalid': fieldState.invalid})}/>
                                            )}/>
                                <label htmlFor="password2"
                                       className={classNames({'p-error': errors.password2})}>Ismételt jelszó*</label>
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
                                                <InputText id={field.name} {...field}
                                                           className={classNames({'p-invalid': fieldState.invalid})}/>
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
                                                <InputText id={field.name} {...field}
                                                           className={classNames({'p-invalid': fieldState.invalid})}/>
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
                                                    onChange={(e) => field.onChange(e.value)}
                                                    dateFormat="yy/mm/dd"
                                                    mask="9999/99/99"
                                                    maxDate={new Date()}
                                                    yearNavigator
                                                    yearRange="1900:2022"
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
                            {getFormErrorMessage('gender')}
                        </div>

                        <Button type="submit" label="Regisztráció" className="card-button"/>
                        {authError ? <p className="card-auth-error">{authError}</p> : null}
                        {!passwordsAreIdentical ?
                            <p className="card-auth-error">A jelszavak nem egyeznek meg!</p> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
