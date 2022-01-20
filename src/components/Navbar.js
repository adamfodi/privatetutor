import React from 'react';
import {useNavigate} from "react-router-dom";
import {Menubar} from 'primereact/menubar';
import {Button} from "primereact/button";


const Navbar = props => {

    const navigate = useNavigate();

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
                end={
                    <React.Fragment>
                        <Button onClick={() => navigate("/signup")} className="p-button-info" label="Sign Up"
                                icon="pi pi-user-plus" style={{marginRight: 20, fontSize: 18}}/>
                        <Button onClick={() => navigate("/signin")} className="p-button-success" label="Sign In"
                                icon="pi pi-sign-in" style={{marginRight: 10, fontSize: 18}}/>
                    </React.Fragment>
                }
            />
        </div>
    );
};

export default Navbar;