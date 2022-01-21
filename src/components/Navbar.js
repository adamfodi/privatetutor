import React from 'react';
import {useNavigate} from "react-router-dom";
import {Menubar} from 'primereact/menubar';
import {Button} from "primereact/button";
import {connect} from "react-redux";
import {signIn, signOut} from "../redux/actions/authActions";


const Navbar = props => {

    const navigate = useNavigate();
    const {auth, signOut} = props;

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
        }

    ];

    return (
        <div>
            <Menubar
                model={items}
                end={!auth.uid
                    ? <React.Fragment>
                        <Button onClick={() => navigate("/signup")} className="p-button-info" label="Regisztráció"
                                icon="pi pi-user-plus" style={{marginRight: 20, fontSize: 18}}/>
                        <Button onClick={() => navigate("/signin")} className="p-button-success" label="Bejelentkezés"
                                icon="pi pi-sign-in" style={{marginRight: 10, fontSize: 18}}/>
                    </React.Fragment>
                    : <React.Fragment>
                        <Button onClick={signOut} className="p-button-danger" label="Kijelentkezés"
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
        // profile: state.firebase.profile
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);