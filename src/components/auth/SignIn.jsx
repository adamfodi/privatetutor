import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {classNames} from 'primereact/utils';
import {clearErrors, signIn} from "../../redux/actions/authActions";
import {connect} from "react-redux";
import "../../assets/css/auth/sign-in.css"
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import Swal from "sweetalert2";

const SignIn = props => {
    const {auth, signIn, clearErrors} = props;

    const defaultValues = {
        email: '',
        password: ''
    };

    const {control, formState: {errors}, handleSubmit, reset} = useForm({defaultValues});

    useEffect(() => {
        if (auth.errors.signIn !== null) {
            clearErrors();
            Swal.fire({
                icon: "error",
                title: "Hibás felhasználónév vagy jelszó!",
                allowOutsideClick: false,
            });
        }
    }, [auth.errors.signIn, clearErrors]);

    const onSubmit = (data) => {
        // Swal.fire({
        //     didOpen: () => {
        //         Swal.showLoading();
        //     },
        //     title: "Bejelentkezés...",
        //     allowOutsideClick: false,
        //     allowEscapeKey: false
        //
        // });
        signIn(data);
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <p className="sign-in-error">{errors[name].message}</p>
    };

    return (
        <div className="sign-in-container">
            <p className="sign-in-header">Bejelentkezés</p>
            <div className="sign-in-content-container">
                <div className="sign-in-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="sign-in-field">
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
                        <div className="sign-in-field">
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
                                                           toggleMask
                                                           feedback={false}
                                                           placeholder="Jelszó"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <Button type="submit"
                                label="Bejelentkezés"
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
        signIn: credentials => dispatch(signIn(credentials)),
        clearErrors: () => dispatch(clearErrors())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
                 