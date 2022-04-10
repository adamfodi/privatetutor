import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Password} from 'primereact/password';
import {classNames} from 'primereact/utils';
import {clearErrors, signUp} from "../../redux/actions/authActions";
import {connect} from "react-redux";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {addLocale} from 'primereact/api';
import "../../assets/css/auth/sign-up.css"
import "../../assets/css/util/calendar.css"
import {addLocaleHu, genderList} from "../../util/FormFields";
import Swal from "sweetalert2";
import {RadioButton} from "primereact/radiobutton";

const SignUp = props => {
    const {myAuth, signUp, clearErrors} = props;
    const [loginRole, setLoginRole] = useState("student");

    const defaultValues = {
        email: '',
        password: '',
        password2: '',
        lastName: '',
        firstName: '',
        birthday: null,
        gender: genderList[0]
    };

    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues});

    addLocale('hu', addLocaleHu);

    const yearNavigatorTemplate = (e) => {
        return <Dropdown
            value={e.value}
            options={e.options}
            onChange={(event) => e.onChange(event.originalEvent, event.value)}
            className="ml-2"
            style={{lineHeight: 1}}
        />
    };

    useEffect(() => {
        if (myAuth.errors.signUp !== null) {
            clearErrors();
            Swal.fire({
                icon: "error",
                title: "Ez az email cím már foglalt!",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }
    }, [myAuth.errors.signUp, clearErrors]);

    const onSubmit = (data) => {
        if (data.password === data.password2) {
            signUp({...data, role: loginRole});
        } else {
            Swal.fire({
                icon: "error",
                title: "A két jelszó nem egyezik meg!",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <p className="error-message">{errors[name].message}</p>
    };

    return (
        <div className="sign-up-container">
            <p className="title">Regisztráció</p>
            <div className="content-container">
                <div className="content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="field">
                        <span className="p-float-label p-input-icon-right">
                            <i className="pi pi-envelope"/>
                                 <Controller name="email"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Email cím megadása kötelező!',
                                                     pattern: {
                                                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                         message: 'Helytelen email cím!'
                                                     }
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <InputText
                                                     id={field.name} {...field}
                                                     className={classNames({'p-invalid': fieldState.invalid})}
                                                     placeholder="Email"
                                                 />
                                             )}
                                 />

                        </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field">
                        <span className="p-float-label">
                                 <Controller name="password"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Jelszó megadása kötelező!'
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <Password
                                                     id={field.name} {...field}
                                                     className={classNames({'p-invalid': fieldState.invalid})}
                                                     feedback
                                                     toggleMask
                                                     placeholder="Jelszó"
                                                     promptLabel="Írjon be egy jelszót"
                                                     weakLabel="Gyenge"
                                                     mediumLabel="Közepes"
                                                     strongLabel="Erős"
                                                     minLength={6}
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <div className="field">
                        <span className="p-float-label">
                                 <Controller name="password2"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Ismételt jelszó megadása kötelező!'
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <Password
                                                     id={field.name} {...field}
                                                     className={classNames({'p-invalid': fieldState.invalid})}
                                                     placeholder="Jelszó újra"
                                                     feedback={false}
                                                     toggleMask
                                                     minLength={6}
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('password2')}
                        </div>
                        <div className="field">
                        <span className="p-float-label">
                                 <Controller name="lastName"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Vezetéknév megadása kötelező!',
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <InputText
                                                     id={field.name} {...field}
                                                     className={classNames({'p-invalid': fieldState.invalid})}
                                                     placeholder="Vezetéknév"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('lastName')}
                        </div>
                        <div className="field">
                        <span className="p-float-label">
                                 <Controller name="firstName"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Keresztnév megadása kötelező!',
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <InputText
                                                     id={field.name} {...field}
                                                     className={classNames({'p-invalid': fieldState.invalid})}
                                                     placeholder="Keresztnév"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('firstName')}
                        </div>
                        <div className="field">
                        <span className="p-float-label">
                                 <Controller name="birthday"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Születésnap megadása kötelező!',
                                                 }
                                             }
                                             render={({field}) => (
                                                 <Calendar
                                                     id={field.name}
                                                     value={field.value}
                                                     onChange={(e) => field.onChange(e.target.value)}
                                                     dateFormat="yy.mm.dd"
                                                     maxDate={new Date()}
                                                     yearNavigator
                                                     yearNavigatorTemplate={yearNavigatorTemplate}
                                                     yearRange="1900:2022"
                                                     selectOtherMonths
                                                     locale="hu"
                                                     placeholder="Születésnap"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('birthday')}
                        </div>
                        <div className="field">
                        <span className="p-float-label">
                                 <Controller name="gender"
                                             control={control}
                                             render={({field}) => (
                                                 <Dropdown
                                                     id={field.name}
                                                     value={field.value}
                                                     onChange={(e) => field.onChange(e.target.value)}
                                                     options={genderList}
                                                 />
                                             )}
                                 />
                        </span>
                        </div>
                        <div className="login-role">
                            <div>
                                <RadioButton
                                    inputId="student"
                                    name="role"
                                    value="student"
                                    onChange={(e) => setLoginRole(e.value)}
                                    checked={loginRole === "student"}
                                />
                                <p>Tanulni szeretnék!</p>
                            </div>
                            <div>
                                <RadioButton
                                    inputId="tutor"
                                    name="role"
                                    value="tutor"
                                    onChange={(e) => setLoginRole(e.value)}
                                    checked={loginRole === "tutor"}
                                />
                                <p>Tanítani szeretnék!</p>
                            </div>
                        </div>
                        <div className="submit-button">
                            <Button type="submit"
                                    label="Regisztráció"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        myAuth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signUp: credentials => dispatch(signUp(credentials)),
        clearErrors: () => dispatch(clearErrors())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
