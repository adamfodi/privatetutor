import {connect, useSelector} from "react-redux";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFirestoreConnect} from "react-redux-firebase";
import {addLocale} from "primereact/api";
import {addLocaleHu} from "../../util/CalendarHu";
import {Controller, useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import "../../assets/css/profile.css"
import {Image} from "primereact/image";
import {FileUpload} from "primereact/fileupload";
import {genderList} from "../../util/FormFields";
import {ProgressSpinner} from "primereact/progressspinner";
import {TabPanel, TabView} from "primereact/tabview";
import Swal from "sweetalert2";
import {clearErrors, signUp} from "../../redux/actions/authActions";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import PersonalProfile from "./PersonalData";
import {cloneDeep} from "lodash";
import ProfilePicture from "./ProfilePicture";

const Profile = props => {
    const {auth, userProfile, signUp, clearErrors} = props;
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (userProfile) {
            console.log("ONLY OVERRIDES THE PROFILE IF THAT CHANGES!")
            setProfile({...userProfile,birthday: userProfile.birthday.toDate()})
        }
    }, [userProfile]);

    return (
        <div className="profile-container">
            <p className="profile-header">Profil</p>
            {profile
                ? <TabView>
                    <TabPanel header="Személyes adatok">
                        <PersonalProfile userProfile={profile}/>
                    </TabPanel>
                    <TabPanel header="Profilkép">
                        <ProfilePicture/>
                    </TabPanel>
                    <TabPanel header="Oktatói adatok">
                        <div className="profile-content">
                            <div className="profile-text-content">
                                <div className="profile-text-field">
                                    <p>asdasddas</p>
                                    <InputText placeholder="vezeteknev"/>
                                </div>
                                <div className="profile-text-field">
                                    <p>asdasd</p>
                                    <InputText placeholder="vezeteknev"/>
                                </div>
                                <div className="profile-text-field">
                                    <p>Születésnap</p>
                                    <Calendar className="profile-calendar"/>
                                </div>
                                <div className="profile-text-field">
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
                    </TabPanel>

                    {/*<Fieldset className="profile-fieldset"*/}
                    {/*          legend="Oktatói adatok"*/}
                    {/*          toggleable*/}
                    {/*>*/}
                    {/*    <div className="profile-content">*/}
                    {/*        <div className="profile-text-content">*/}
                    {/*            <div className="profile-text-row">*/}
                    {/*                <p>Képzettség</p>*/}
                    {/*                <InputText placeholder="vezeteknev"/>*/}
                    {/*            </div>*/}
                    {/*            <div className="profile-text-row">*/}
                    {/*                <p>Oktatott tárgyak</p>*/}
                    {/*                <div className="profile-multiSelectDiv">*/}
                    {/*                    <MultiSelect className="profile-multiSelect"*/}
                    {/*                                 value={selectedSubjects}*/}
                    {/*                                 options={subjects}*/}
                    {/*                                 onChange={(e) => setSelectedSubjects(e.value)}*/}
                    {/*                                 optionLabel="name"*/}
                    {/*                                 placeholder="Tantárgyak"*/}
                    {/*                                 showClear*/}
                    {/*                                 filter*/}
                    {/*                                 filterBy="name"*/}
                    {/*                                 filterMatchMode="startsWith"*/}
                    {/*                                 emptyFilterMessage="Nem található..."*/}
                    {/*                                 selectedItemsLabel={"(" + (selectedSubjects ? selectedSubjects.size : 0) + ")"}*/}

                    {/*                    />*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className="profile-text-row3">*/}
                    {/*                <Chips value={selectedSubjects ? selectedSubjects.map(s => s.name) : null}*/}
                    {/*                       separator=","*/}
                    {/*                       disabled*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*            <div className="profile-text-row2">*/}
                    {/*                <p>Bemutatkozás</p>*/}
                    {/*                <div>*/}
                    {/*                    <Editor*/}
                    {/*                        headerTemplate={editorHeader}*/}
                    {/*                        value={null}*/}
                    {/*                        onTextChange={(e) => ({})}*/}
                    {/*                        style={{height: "250px"}}*/}
                    {/*                    />*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className="profile-text-row">*/}
                    {/*                <p>Oktatott tárgyak</p>*/}
                    {/*                <Dropdown className="profile-dropdown"> </Dropdown>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className="profile-stars">*/}
                    {/*            <p className="profile-stars-number">4.2</p>*/}
                    {/*            <StarRatings*/}
                    {/*                title="asdasd"*/}
                    {/*                rating={4.2}*/}
                    {/*                starRatedColor="orange"*/}
                    {/*                numberOfStars={5}*/}
                    {/*                starDimension={"40px"}*/}
                    {/*                name='rating'*/}
                    {/*            />*/}
                    {/*            <p className="profile-stars-text">15 visszajelzés alapján</p>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</Fieldset>*/}
                </TabView>
                : <div>
                    <ProgressSpinner/>
                </div>
            }
        </div>
    )
}


const mapStateToProps = state => {
    // console.log("MAPSTATETOPROPS")
    // console.log(state)
    return {
        firebaseAuth: state.firebase.auth,
        auth: state.auth,
        users: state.firestore.data.users,
        userProfile: state.firebase.auth.isLoaded && state.firestore.data.users ? state.firestore.data.users[state.firebase.auth.uid] : null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signUp: credentials => dispatch(signUp(credentials)),
        clearErrors: () => dispatch(clearErrors())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);