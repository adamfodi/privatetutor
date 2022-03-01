import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import "../../assets/css/profile.css"
import {ProgressSpinner} from "primereact/progressspinner";
import {TabPanel, TabView} from "primereact/tabview";
import PersonalData from "./PersonalData";
import ProfilePicture from "./ProfilePicture";
import ProfessionalData from "./ProfessionalData";

const Profile = props => {
    const {userProfile} = props;
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (userProfile) {
            console.log("ONLY OVERRIDES THE PROFILE IF THAT CHANGES!")
            setProfile({
                ...userProfile,
                personalData: {...userProfile.personalData, birthday: userProfile.personalData.birthday.toDate()}
            })
        }
    }, [userProfile]);

    console.log(profile)

    return (
        <div className="profile-container">
            <p className="profile-header">Profil</p>
            {profile
                ? <TabView>
                    <TabPanel header="Személyes adatok">
                        <PersonalData personalData={profile.personalData}/>
                    </TabPanel>
                    <TabPanel header="Profilkép">
                        <ProfilePicture/>
                    </TabPanel>
                    <TabPanel header="Oktatói adatok">
                        <ProfessionalData professionalData={profile.professionalData}/>
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
        userProfile: state.firebase.auth.isLoaded && state.firestore.data.users ? state.firestore.data.users[state.firebase.auth.uid] : null
    };
};

export default connect(mapStateToProps)(Profile);