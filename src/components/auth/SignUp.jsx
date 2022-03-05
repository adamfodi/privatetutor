import React, {useEffect} from 'react';
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
import {genderList} from "../../util/FormFields";
import {addLocaleHu} from "../../util/CalendarHu";
import Swal from "sweetalert2";

const SignUp = props => {
    const {auth, signUp, clearErrors} = props;

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
        return <Dropdown value={e.value}
                         options={e.options}
                         onChange={(event) => e.onChange(event.originalEvent, event.value)}
                         className="ml-2"
                         style={{lineHeight: 1}}
        />
    };

    useEffect(() => {
        if (auth.errors.signUp !== null) {
            clearErrors();
            Swal.fire({
                icon: "error",
                title: "Ez az email cím már foglalt!",
                allowOutsideClick: false,
            });
        }
    }, [auth.errors.signUp, clearErrors]);

    const onSubmit = (data) => {
        if (data.password === data.password2) {
            // Swal.fire({
            //     didOpen: () => {
            //         Swal.showLoading();
            //     },
            //     title: "Regisztráció...",
            //     allowOutsideClick: false,
            //     allowEscapeKey: false
            //
            // });
            signUp(data);
        } else {
            Swal.fire({
                icon: "error",
                title: "A két jelszó nem egyezik meg!",
                allowOutsideClick: false,
            });
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <p className="sign-up-error">{errors[name].message}</p>
    };

    console.log(control)

    return (
        <div className="sign-up-container">
            <p className="sign-up-header">Regisztráció</p>
            <div className="sign-up-content-container">
                <div className="sign-up-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="sign-up-field">
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
                                                 <InputText id={field.name} {...field}
                                                            className={classNames({'p-invalid': fieldState.invalid})}
                                                            placeholder="Email"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="sign-up-field">
                        <span className="p-float-label">
                                 <Controller name="password"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Jelszó megadása kötelező!'
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <Password id={field.name} {...field}
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
                        <div className="sign-up-field">
                        <span className="p-float-label">
                                 <Controller name="password2"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Ismételt jelszó megadása kötelező!'
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <Password id={field.name} {...field}
                                                           className={classNames({'p-invalid': fieldState.invalid})}
                                                           placeholder="Jelszó ismét"
                                                           feedback={false}
                                                           toggleMask
                                                           minLength={6}
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('password2')}
                        </div>
                        <div className="sign-up-field">
                        <span className="p-float-label">
                                 <Controller name="lastName"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Vezetéknév megadása kötelező!',
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <InputText id={field.name} {...field}
                                                            className={classNames({'p-invalid': fieldState.invalid})}
                                                            placeholder="Vezetéknév"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('lastName')}
                        </div>
                        <div className="sign-up-field">
                        <span className="p-float-label">
                                 <Controller name="firstName"
                                             control={control}
                                             rules={
                                                 {
                                                     required: 'Keresztnév megadása kötelező!',
                                                 }
                                             }
                                             render={({field, fieldState}) => (
                                                 <InputText id={field.name} {...field}
                                                            className={classNames({'p-invalid': fieldState.invalid})}
                                                            placeholder="Keresztnév"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('firstName')}
                        </div>
                        <div className="sign-up-field">
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
                        <div className="sign-up-field">
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

                        <Button type="submit"
                                label="Regisztráció"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signUp: credentials => dispatch(signUp(credentials)),
        clearErrors: () => dispatch(clearErrors())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
