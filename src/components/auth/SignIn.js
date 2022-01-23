import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Password} from 'primereact/password';
import {classNames} from 'primereact/utils';
import {signIn} from "../../redux/actions/authActions";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";

const SignIn = props => {
    const {authError, auth} = props;
    const navigate = useNavigate();
    const defaultValues = {
        email: '',
        password: ''
    };
    const {control, formState: {errors}, handleSubmit, reset} = useForm({defaultValues});

    useEffect(() => {
        if (!(auth.isLoaded && auth.isEmpty)) {
            navigate("/indexStudent")
        }

    }, [auth, navigate]);

    const onSubmit = (data) => {
        props.signIn(data);
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <p className="card-field-error">{errors[name].message}</p>
    };

    return (
        <div className="form">
            <div className="card">
                <div className="card-name">
                    <h1>Bejelentkezés</h1>
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
                                                          feedback={false}
                                                          className={classNames({'p-invalid': fieldState.invalid})}/>
                                            )}/>
                                <label htmlFor="password"
                                       className={classNames({'p-error': errors.password})}>Jelszó*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>

                        <Button type="submit" label="Bejelentkezés" className="card-button"/>
                        {authError ? <p className="card-auth-error">{authError}</p> : null}
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
        signIn: credentials => dispatch(signIn(credentials))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
                 