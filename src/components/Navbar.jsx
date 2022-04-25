import React, {useMemo, useRef} from 'react';
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
    const {role, firebaseAuth, personalData, clearRole} = props;
    const navigate = useNavigate();
    const menu = useRef(null);
    const displayName = personalData ? personalData.fullName : null;

    const menubarStartTemplate = () => {
        if (firebaseAuth.uid) {
            if (role === "student") {
                return <p>Hallgató</p>
            }

            if (role === "tutor") {
                return <p>Oktató</p>
            }
        }
        return null;
    }

    const menubarEndTemplate = () => {
        return firebaseAuth.isEmpty
            ? <div className="auth-buttons">
                <Button
                    onClick={() => navigate("/signup")}
                    className="p-button-primary"
                    label="Regisztráció"
                    icon="pi pi-user-plus"
                />

                <Button
                    onClick={() => navigate("/signin")}
                    className="p-button-success"
                    label="Bejelentkezés"
                    icon="pi pi-sign-in"
                />
            </div>
            : <div className="user-menu">
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
                />
            </div>
    }

    const mainItems = useMemo(() => {
        const items = []

        items.push(
            {
                label: 'Főoldal',
                icon: 'pi pi-fw pi-home',
                command: () => {
                    navigate("/main")
                }
            },
        );

        items.push(
            {
                label: 'Magánóráim',
                icon: 'pi pi-fw pi-home',
                command: () => {
                    navigate("/private-lessons")
                }
            },
        );

        if (role === 'tutor') {
            items.push(
                {
                    label: 'Hirdetés',
                    icon: 'pi pi-fw pi-pencil',
                    command: () => {
                        navigate("/tutor/ad")
                    },
                },
            );
        }

        items.push(
            {
                label: 'Fórum',
                icon: 'pi pi-fw pi-pencil',
                command: () => {
                    navigate("/main")
                },
                disabled: true
            },
        );

        return items;

    }, [navigate, role])

    const userItems = useMemo(() => {
        return [
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
                command: () => {
                    navigate("/messages")
                }
            },

            {
                label: 'Kijelentkezés',
                icon: 'pi pi-sign-out',
                command: () => {
                    AuthService.signOut()
                        .then(() => {
                            clearRole()
                        });
                }
            },
        ]
    }, [clearRole, navigate])

    return (
        <div className="navbar-container">
            <Menubar
                start={menubarStartTemplate}
                model={mainItems}
                end={menubarEndTemplate}
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