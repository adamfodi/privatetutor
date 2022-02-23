import React, {useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {Menubar} from 'primereact/menubar';
import {Button} from "primereact/button";
import {connect} from "react-redux";
import {signOut} from "../../redux/actions/authActions";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {Menu} from "primereact/menu";
import "../../App.css"


const Navbar = props => {

    const navigate = useNavigate();
    const menu = useRef(null);
    const {auth,displayName} = props;


    const mainItems = [
        {
            label: 'Főoldal',
            icon: 'pi pi-fw pi-home',
            command: () => {
                navigate("/main")
            }
        },

        {
            label: 'Órarend',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                navigate("")
            },
            disabled: true
        },

        {
            label: 'Kurzusok',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Jelentkezett',
                    icon: 'pi pi-fw pi-pencil',
                    command: () => {
                        navigate("")
                    },
                    disabled: true
                },
                {
                    label: 'Saját',
                    icon: 'pi pi-fw pi-align-right',
                    command: () => {
                        navigate("/mycourses")
                    },
                    disabled: !displayName
                },
            ]
        },

        {
            label: 'Privát órák',
            icon: 'pi pi-fw pi-eye',
            command: () => {
                navigate("")
            },
            disabled: true
        },

        {
            label: 'Tesztek',
            icon: 'pi pi-fw pi-copy',
            command: () => {
                navigate("")
            },
            disabled: true
        },
    ];

    const userItems = [
        {
            label: 'Profil',
            icon: 'pi pi-user',
            command: () => {
                navigate("/profile")
            },
        },

        {
            label: 'Üzenetek',
            icon: 'pi pi-envelope',
            badge: '8',
            command: () => {
                navigate("")
            },
            disabled: true
        },

        {
            label: 'Kijelentkezés',
            icon: 'pi pi-sign-out',
            command: () => {
                props.signOut();
            }
        },

    ];

    return (
        <div>
            <Menubar
                model={mainItems}
                end={!auth.uid
                    ? <React.Fragment>
                        <Button
                            onClick={() => navigate("/signup")}
                            className="p-button-info"
                            label="Regisztráció"
                            icon="pi pi-user-plus"
                            style={{marginRight: 20, fontSize: 18}}
                        />

                        <Button
                            onClick={() => navigate("/signin")}
                            className="p-button-success"
                            label="Bejelentkezés"
                            icon="pi pi-sign-in"
                            style={{marginRight: 10, fontSize: 18}}
                        />
                    </React.Fragment>
                    : <React.Fragment>
                        <Menu
                            model={userItems}
                            popup
                            ref={menu}
                            id="popup_menu"/>
                        <Button
                            label={displayName}
                            icon="pi pi-chevron-down"
                            iconPos="right"
                            onClick={(event) => menu.current.toggle(event)}
                            aria-controls="popup_menu" aria-haspopup
                            style={{marginRight: 10, fontSize: 18}}
                        />
                    </React.Fragment>
                }
            />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        users: state.firestore.ordered.users,
        auth: state.firebase.auth,
        displayName: state.user.displayName
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => ['users'])
)(Navbar);