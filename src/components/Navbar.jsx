import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Menubar} from 'primereact/menubar';
import {Button} from "primereact/button";
import {connect} from "react-redux";
import {signOut} from "../redux/actions/authActions";
import {compose} from "redux";
import {Menu} from "primereact/menu";
import "../App.css"


const Navbar = props => {
    const navigate = useNavigate();
    const menu = useRef(null);
    const {auth,personalData} = props;
    const displayName = personalData ? personalData.lastName + ' ' + personalData.firstName : null;

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
                    label: 'Hirdetés',
                    icon: 'pi pi-fw pi-pencil',
                    command: () => {
                        navigate("/tutor/advertisement")
                    }
                },
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
                end={auth.isEmpty
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
        auth: state.firebase.auth,
        personalData: !state.firebase.auth.isEmpty && state.firestore.data.users
            ? state.firestore.data.users[state.firebase.auth.uid]['profile']['personalData']
            : null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps))(Navbar);