import React from 'react';
import {useNavigate} from "react-router-dom";
import {Menubar} from 'primereact/menubar';
import {Button} from "primereact/button";
import {connect} from "react-redux";
import {signOut} from "../redux/actions/authActions";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";


const Navbar = props => {

    const navigate = useNavigate();
    const {auth, users} = props;

    const items = [
        {
            label: 'Főoldal',
            icon: 'pi pi-fw pi-home',
            command: () => {
                navigate("")
            }
        },

        {
            label: 'Órarend',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                navigate("")
            }
        },

        {
            label: 'Magánórák',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Létrehozás',
                    icon: 'pi pi-fw pi-align-left',
                    command: () => {
                        navigate("/createlesson")
                    }
                },
                {
                    label: 'Meghirdetett órák',
                    icon: 'pi pi-fw pi-align-right'
                },
            ]
        },


    ];

    return (
        <div>
            <Menubar
                model={items}
                end={auth.isLoaded && auth.isEmpty
                    ? <React.Fragment>
                        <Button onClick={() => navigate("/signup")} className="p-button-info" label="Regisztráció"
                                icon="pi pi-user-plus" style={{marginRight: 20, fontSize: 18}}/>
                        <Button onClick={() => navigate("/signin")} className="p-button-success" label="Bejelentkezés"
                                icon="pi pi-sign-in" style={{marginRight: 10, fontSize: 18}}/>
                    </React.Fragment>
                    : <React.Fragment>
                        <Button onClick={props.signOut} className="p-button-danger" label="Kijelentkezés"
                                icon="pi pi-sign-out" style={{marginRight: 10, fontSize: 18}}/>
                    </React.Fragment>
                }
            />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut())
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => ['users'])
)(Navbar);