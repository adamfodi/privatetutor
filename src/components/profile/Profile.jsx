import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import "../../assets/css/profile/profile.css"
import {ProgressSpinner} from "primereact/progressspinner";
import {TabPanel, TabView} from "primereact/tabview";
import PersonalData from "./PersonalData";
import ProfilePicture from "./ProfilePicture";

const Profile = props => {
    const {profile} = props;
    const [newProfile, setNewProfile] = useState(null);

    useEffect(() => {
        if (profile) {
            setNewProfile({
                ...profile,
                personalData: {...profile.personalData, birthday: profile.personalData.birthday.toDate()}
            })
        }
    }, [profile]);

    console.log(newProfile)

    return (
        <div className="profile-container">
            <p className="profile-header">Profil</p>
            {newProfile
                ? <TabView>
                    <TabPanel header="Személyes adatok">
                        <PersonalData personalData={newProfile.personalData}/>
                    </TabPanel>
                    <TabPanel header="Profilkép">
                        <ProfilePicture/>
                    </TabPanel>
                    <TabPanel header="Visszajelzések">

                    </TabPanel>
                </TabView>
                : <div>
                    <ProgressSpinner/>
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        profile: !state.firebase.auth.isEmpty && !state.firebase.profile.isEmpty
            ? state.firebase.profile.profile
            : null
    };
};

export default connect(mapStateToProps)(Profile);