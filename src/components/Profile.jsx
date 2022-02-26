import {connect, useSelector} from "react-redux";
import React, {useState} from "react";
import {useFirestoreConnect} from "react-redux-firebase";
import {addLocale} from "primereact/api";
import {addLocaleHu} from "../util/CalendarHu";
import {useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import "../assets/css/profile.css"
import {Image} from "primereact/image";
import {FileUpload} from "primereact/fileupload";
import {Fieldset} from "primereact/fieldset";
import StarRatings from "react-star-ratings/build/star-ratings";
import {Editor} from "primereact/editor";
import {MultiSelect} from "primereact/multiselect";
import {Chips} from "primereact/chips";

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

    // console.log(userProfile)


    const genderList = ["Férfi", "Nő", "Egyéb"];

    const subjects = [
        {name: 'Matematika', code: 'MAT'},
        {name: 'Informatika', code: 'INF'},
        {name: 'Földrajz', code: 'FOL'},
        {name: 'Biológia', code: 'BIO'},
        {name: 'Kémia', code: 'KEM'},
        {name: 'Fizika', code: 'FIZ'},
        {name: 'Történelem', code: 'TOR'},
        {name: 'Rajz', code: 'RAJ'},
    ];

    const [selectedSubjects, setSelectedSubjects] = useState(null);

    const defaultValues = {
        lastname: userProfile.lastName,
        firstname: userProfile.firstName,
        fullname: userProfile.fullName,
        birthday: new Date(userProfile.birthday),
        gender: userProfile.gender
    };

    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues});

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options}
                         onChange={(event) => e.onChange(event.originalEvent, event.value)} className="ml-2"
                         style={{lineHeight: 1}}/>;
    }

    const onSubmit = (data) => {
        console.log(data)
        props.signUp({...data, fullname: data.lastname + ' ' + data.firstname});
    };


    addLocale('hu', addLocaleHu);

    const header = (
        <div id="standalone-container">
            <div id="toolbar-container">
                <span className="ql-formats">
                    <select className="ql-size"/>
                </span>
                <span className="ql-formats">
                    <button className="ql-bold"/>
                    <button className="ql-italic"/>
                    <button className="ql-underline"/>
                </span>
                <span className="ql-formats">
                    <select className="ql-color"/>
                    <select className="ql-background"/>
                </span>
                <span className="ql-formats">
                    <button className="ql-blockquote"/>
                    <button className="ql-code-block"/>
                    <button className="ql-link"/>
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered"/>
                    <button className="ql-list" value="bullet"/>
                </span>
                <span className="ql-formats">
                    <select className="ql-align"/>
                </span>
                <span className="ql-formats">
                    <button className="ql-script" value="sub"/>
                    <button className="ql-script" value="super"/>
                </span>
            </div>
        </div>
    );

    return (
        <div className="profile-container">
            <p className="profile-header">Profil</p>
            <Fieldset className="profile-fieldset"
                      legend="Személyes adatok"
                      toggleable
            >
                <div className="profile-content">
                    <div className="profile-text-content">
                        <div className="profile-text-row">
                            <p>Vezetéknév</p>
                            <InputText placeholder="vezeteknev"/>
                        </div>
                        <div className="profile-text-row">
                            <p>Keresztnév</p>
                            <InputText placeholder="vezeteknev"/>
                        </div>
                        <div className="profile-text-row">
                            <p>Születésnap</p>
                            <Calendar className="profile-calendar"/>
                        </div>
                        <div className="profile-text-row">
                            <p>Nem</p>
                            <Dropdown className="profile-dropdown"> </Dropdown>
                        </div>

                    </div>
                    <div className="profile-picture-content">
                        <Image src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
                               alt="Image"
                               width="250"
                               height="250"
                               preview
                               downloadable
                        />
                        <FileUpload
                            mode="basic"
                            name="demo[]"
                            url="https://primefaces.org/primereact/showcase/upload.php"
                            accept="image/*"
                            maxFileSize={1000000}
                            onUpload={() => {
                            }}
                            auto
                            chooseLabel="Feltöltés"
                        />
                    </div>
                </div>
            </Fieldset>

            <Fieldset className="profile-fieldset"
                      legend="Oktatói adatok"
                      toggleable
            >
                <div className="profile-content">
                    <div className="profile-text-content">
                        <div className="profile-text-row">
                            <p>Képzettség</p>
                            <InputText placeholder="vezeteknev"/>
                        </div>
                        <div className="profile-text-row">
                            <p>Oktatott tárgyak</p>
                            <div className="profile-multiSelectDiv">
                                <MultiSelect className="profile-multiSelect"
                                             value={selectedSubjects}
                                             options={subjects}
                                             onChange={(e) => setSelectedSubjects(e.value)}
                                             optionLabel="name"
                                             placeholder="Tantárgyak"
                                             showClear
                                             filter
                                             filterBy="name"
                                             filterMatchMode="startsWith"
                                             emptyFilterMessage="Nem található..."
                                             selectedItemsLabel={"(" + (selectedSubjects ? selectedSubjects.size : 0) + ")"}

                                />
                            </div>
                        </div>
                        <div className="profile-text-row3">
                            <Chips value={selectedSubjects ? selectedSubjects.map(s => s.name) : null}
                                   separator=","
                                   disabled
                            />
                        </div>
                        <div className="profile-text-row2">
                            <p>Bemutatkozás</p>
                            {/*<InputTextarea*/}
                            {/*    className="profile-inputTextArea"*/}
                            {/*    value={null}*/}
                            {/*    onChange={(e) => ({})}*/}
                            {/*    rows={10}*/}
                            {/*    autoResize*/}
                            {/*/>*/}
                            <div>
                                <Editor
                                    headerTemplate={header}
                                    value={null}
                                    onTextChange={(e) => ({})}
                                    style={{height: "250px"}}
                                />
                            </div>
                        </div>
                        <div className="profile-text-row">
                            <p>Oktatott tárgyak</p>
                            <Dropdown className="profile-dropdown"> </Dropdown>
                        </div>
                    </div>
                    <div className="profile-stars">
                        <p className="profile-stars-number">4.2</p>
                        <StarRatings
                            title="asdasd"
                            rating={4.2}
                            starRatedColor="orange"
                            numberOfStars={5}
                            starDimension={"40px"}
                            name='rating'
                        />
                        <p className="profile-stars-text">15 visszajelzés alapján</p>
                    </div>
                </div>
            </Fieldset>


            {/*<div className="form">*/}
            {/*    <div className="card">*/}
            {/*        <h1>Profil</h1>*/}
            {/*        <div>*/}
            {/*            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">*/}

            {/*                <div className="card-field">*/}
            {/*                <span className="p-float-label">*/}
            {/*                    <Controller name="lastname"*/}
            {/*                                control={control}*/}
            {/*                                rules={{*/}
            {/*                                    required: 'Vezetéknév megadása kötelező!'*/}
            {/*                                }}*/}
            {/*                                render={({field, fieldState}) => (*/}
            {/*                                    <InputText id={field.name}*/}
            {/*                                               {...field}*/}
            {/*                                               className={classNames({'p-invalid': fieldState.invalid})}*/}
            {/*                                    />*/}
            {/*                                )}/>*/}
            {/*                    <label htmlFor="lastname"*/}
            {/*                           className={classNames({'p-error': !!errors.lastname})}>Vezetéknév*</label>*/}
            {/*                </span>*/}
            {/*                </div>*/}

            {/*                <div className="card-field">*/}
            {/*                <span className="p-float-label">*/}
            {/*                    <Controller name="firstname"*/}
            {/*                                control={control}*/}
            {/*                                rules={{*/}
            {/*                                    required: 'Keresztnév megadása kötelező!'*/}
            {/*                                }}*/}
            {/*                                render={({field, fieldState}) => (*/}
            {/*                                    <InputText id={field.name}*/}
            {/*                                               {...field}*/}
            {/*                                               className={classNames({'p-invalid': fieldState.invalid})}*/}
            {/*                                    />*/}
            {/*                                )}/>*/}
            {/*                    <label htmlFor="firstname"*/}
            {/*                           className={classNames({'p-error': !!errors.lastname})}>Keresztnév*</label>*/}
            {/*                </span>*/}
            {/*                </div>*/}

            {/*                <div className="card-field">*/}
            {/*                <span className="p-float-label">*/}
            {/*                    <Controller name="birthday"*/}
            {/*                                control={control}*/}
            {/*                                rules={{*/}
            {/*                                    required: 'Születésnap megadása kötelező!'*/}
            {/*                                }}*/}
            {/*                                render={({field}) => (*/}
            {/*                                    <Calendar*/}
            {/*                                        id={field.name}*/}
            {/*                                        value={field.value}*/}
            {/*                                        onChange={(e) => field.onChange(e.value)}*/}
            {/*                                        dateFormat="yy.mm.dd"*/}
            {/*                                        maxDate={new Date()}*/}
            {/*                                        yearNavigator*/}
            {/*                                        yearNavigatorTemplate={yearNavigatorTemplate}*/}
            {/*                                        yearRange="1900:2022"*/}
            {/*                                        selectOtherMonths*/}
            {/*                                        locale="hu"*/}
            {/*                                        showIcon*/}
            {/*                                    />*/}
            {/*                                )}/>*/}
            {/*                    <label htmlFor="birthday"*/}
            {/*                           className={classNames({'p-error': !!errors.birthday})}>Születésnap*</label>*/}
            {/*                </span>*/}
            {/*                </div>*/}

            {/*                <div className="card-field">*/}
            {/*                <span className="p-float-label" style={{textAlign: "left"}}>*/}
            {/*                    <Controller name="gender"*/}
            {/*                                control={control}*/}
            {/*                                render={({field}) => (*/}
            {/*                                    <Dropdown*/}
            {/*                                        id={field.name}*/}
            {/*                                        value={field.value}*/}
            {/*                                        onChange={(e) => field.onChange(e.value)}*/}
            {/*                                        options={genderList}*/}
            {/*                                    />*/}
            {/*                                )}/>*/}
            {/*                </span>*/}
            {/*                </div>*/}

            {/*                <Button type="submit" label="Regisztráció" className="card-button"/>*/}
            {/*            </form>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}


const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
    };
};

export default connect(mapStateToProps)(Profile);