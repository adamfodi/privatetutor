import {connect, useSelector} from "react-redux";
import React from "react";
import {useFirestoreConnect} from "react-redux-firebase";
import {Card} from "primereact/card";
import {addLocale} from "primereact/api";
import {addLocaleHu} from "../util/CalendarHu";
import {Controller, useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";

const Profile = props => {
    useFirestoreConnect([
        {
            collection: 'users',
            doc: props.auth.uid
        }
    ])
    const userProfile = useSelector(
        ({firestore: {data}}) => data.users && data.users[props.auth.uid]
    )
    const genderList = ["Férfi", "Nő", "Egyéb"];

    console.log(userProfile.birthday)
    console.log(new Date(userProfile.birthday))


    const defaultValues = {
        lastname: userProfile.lastName,
        firstname: userProfile.firstName,
        fullname: userProfile.fullName,
        birthday: new Date(userProfile.birthday),
        gender: userProfile.gender
    };

    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues});

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="ml-2" style={{ lineHeight: 1 }} />;
    }

    const onSubmit = (data) => {
            console.log(data)
            props.signUp({...data, fullname: data.lastname + ' ' + data.firstname});
    };


    addLocale('hu', addLocaleHu);

    return (
        <Card style={{marginTop: "5em", textAlign: "center"}}>
            <div className="form">
                <div className="card">
            <h1>Profil</h1>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

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
                                                    dateFormat="yy.mm.dd"
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
                </form>
            </div>
                </div>
            </div>
        </Card>
    )
}


const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
    };
};

export default connect(mapStateToProps)(Profile);