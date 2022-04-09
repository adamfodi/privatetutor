import {connect} from "react-redux";
import {addLocale} from "primereact/api";
import {Controller, useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import "../../assets/css/profile/personal-data.css"
import "../../assets/css/util/calendar.css"
import {addLocaleHu, genderList} from "../../util/FormFields";
import Swal from "sweetalert2";
import {updateDisplayName} from "../../redux/actions/authActions";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import {UserService} from "../../services/UserService";

const PersonalData = (props) => {
    const {firebaseAuth, personalData, updateDisplayName} = props;
    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues: personalData});

    addLocale('hu', addLocaleHu);

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value}
                         options={e.options}
                         onChange={(event) => e.onChange(event.originalEvent, event.value)}
                         className="ml-2"
                         style={{lineHeight: 1}}
        />
    };

    const onSubmit = (data) => {
        const dataWithFullName = {...data, fullName: data.lastName + ' ' + data.firstName};
        UserService.updatePersonalData(firebaseAuth.uid, dataWithFullName)
            .then(() => {
                Swal.fire({
                    timer: 1500,
                    icon: "success",
                    title: "Sikeres módosítás!",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                })
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Hiba történt az adatok módosítása során!",
                    allowOutsideClick: false,
                });
            })
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <span className="sign-up-error">{errors[name].message}</span>
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="personal-data-field-container">
                <div className="personal-data-fields">
                    <div className="personal-data-field">
                        <div className="personal-data-field-data">
                            <p>Vezetéknév</p>
                            <span>
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
                                                />
                                            )}
                                />
                            </span>
                        </div>
                        {getFormErrorMessage('lastName')}
                    </div>
                    <div className="personal-data-field">
                        <div className="personal-data-field-data">
                            <p>Keresztnév</p>
                            <span>
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
                                                />
                                            )}
                                />
                            </span>
                        </div>
                        {getFormErrorMessage('firstName')}
                    </div>
                    <div className="personal-data-field">
                        <div className="personal-data-field-data">
                            <p>Születésnap</p>
                            <span>
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
                        </div>
                        {getFormErrorMessage('birthday')}
                    </div>
                    <div className="personal-data-field">
                        <div className="personal-data-field-data">
                            <p>Nem</p>
                            <span>
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
                    </div>
                </div>
            </div>
            <div className="personal-data-button-container">
                <Button type="submit"
                        label="Módosítások mentése"
                        className="personal-data-submit-button p-button-success"
                />
            </div>
        </form>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        firebaseAuth: state.firebase.auth,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateDisplayName: displayName => dispatch(updateDisplayName(displayName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalData);