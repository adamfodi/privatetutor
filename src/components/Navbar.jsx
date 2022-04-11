import React, {useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {Menubar} from 'primereact/menubar';
import {Button} from "primereact/button";
import {connect} from "react-redux";
import {compose} from "redux";
import {Menu} from "primereact/menu";
import "../assets/css/navbar.css"
import {AuthService} from "../services/AuthService";
import {clearRole} from "../redux/actions/roleActions";


const Navbar = props => {
    const navigate = useNavigate();
    const menu = useRef(null);
    const {role, firebaseAuth, personalData} = props;
    const displayName = personalData ? personalData.fullName : null;

    console.log(role)

    const menubarStartTemplate = () => {
        switch (role) {
            case "student":
                return <p>Hallgató</p>

            case "tutor":
                return <p>Oktató</p>

            case "admin":
                return <p>Admin</p>

            default:
                return null;
        }
    }

    const mainItems = [
        {
            label: 'Főoldal',
            icon: 'pi pi-fw pi-home',
            command: () => {
                navigate("/main")
            }
        },

        {
            label: 'Test',
            command: () => {
                navigate("/test")
            }
        },

        {
            label: 'Hallgató',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Magánórák',
                    icon: 'pi pi-fw pi-pencil',
                    command: () => {
                        navigate("")
                    },
                },
                {
                    label: 'Tesztek',
                    icon: 'pi pi-fw pi-align-right',
                    command: () => {
                        navigate("")
                    },
                },
            ]
        },

        {
            label: 'Oktató',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Hirdetés beállítása',
                    icon: 'pi pi-fw pi-pencil',
                    command: () => {
                        navigate("/tutor/advertisement")
                    }
                },
                {
                    label: 'Magánórák',
                    icon: 'pi pi-fw pi-pencil',
                    command: () => {
                        navigate("/tutor/private-lessons")
                    },
                },
                {
                    label: 'Tesztek',
                    icon: 'pi pi-fw pi-align-right',
                    command: () => {
                        navigate("")
                    },
                },
                {
                    label: 'Kulonszobateszt',
                    icon: 'pi pi-fw pi-align-right',
                    command: () => {
                        navigate("/teaching-room/asd123asd")
                    },

                },
            ]
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
                AuthService.signOut()
                    .then(() => {
                        props.clearRole()
                    });
            }
        },

    ];

    return (
        <div>
            <Menubar
                start={menubarStartTemplate}
                model={mainItems}
                end={firebaseAuth.isEmpty
                    ? <React.Fragment>
                        <Button
                            onClick={() => navigate("/signup")}
                            className="p-button-primary"
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
                            id="popup_menu"
                        />
                        <Button
                            label={displayName ? displayName : "Loading..."}
                            className="p-button-outlined p-button-danger"
                            icon="pi pi-chevron-down"
                            iconPos="right"
                            onClick={(event) => menu.current.toggle(event)}
                            aria-controls="popup_menu"
                            aria-haspopup
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
        role: state.role,
        firebaseAuth: state.firebase.auth,
        personalData: !state.firebase.auth.isEmpty && !state.firebase.profile.isEmpty
            ? state.firebase.profile.profile.personalData
            : null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearRole: () => dispatch(clearRole())
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps))(Navbar);