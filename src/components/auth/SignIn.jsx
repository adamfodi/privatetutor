import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {classNames} from 'primereact/utils';
import {connect} from "react-redux";
import "../../assets/css/auth/sign-in.css"
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import Swal from "sweetalert2";
import {roles} from "../../util/FormFields";
import {AuthService} from "../../services/AuthService";
import {setRole} from "../../redux/actions/roleActions";

const SignIn = props => {
    const defaultValues = {
        email: '',
        password: '',
        role: roles[0].value
    };

    const {control, formState: {errors}, handleSubmit, reset} = useForm({defaultValues});

    const onSubmit = (data) => {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Bejelentkezés...",
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        AuthService.signIn(data)
            .then(() => {
                props.setRole(data.role)
                Swal.fire({
                    didOpen: () => {
                        Swal.hideLoading();
                    },
                    timer: 1200,
                    icon: "success",
                    title: "Sikeres bejelentkezés!",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Hibás felhasználónév vagy jelszó!",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                reset();
            })
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <p className="error-message">{errors[name].message}</p>
    };

    return (
        <div className="sign-in-container">
            <p className="title">Bejelentkezés</p>
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
                                                     toggleMask
                                                     feedback={false}
                                                     placeholder="Jelszó"
                                                 />
                                             )}
                                 />
                        </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <div className="field">
                        <span className="p-float-label">
                                 <Controller name="role"
                                             control={control}
                                             render={({field}) => (
                                                 <Dropdown
                                                     id={field.name} {...field}
                                                     value={field.value}
                                                     onChange={(e) => field.onChange(e.value)}
                                                     options={roles}
                                                     optionLabel="name"
                                                 />
                                             )}
                                 />
                        </span>
                        </div>
                        <div className="submit-button">
                            <Button
                                type="submit"
                                label="Bejelentkezés"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        setRole: role => dispatch(setRole(role))
    };
};

export default connect(null, mapDispatchToProps)(SignIn);
                 