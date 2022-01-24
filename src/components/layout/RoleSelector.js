import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import {Button} from "primereact/button";


const RoleSelector = props => {

    const navigate = useNavigate();
    const {auth, role} = props;

    useEffect(() => {
        if (role || auth.isEmpty) {
            navigate("/main")
        }

    }, [auth, navigate]);


    return (
        <div>
            <Button label="Secondary" className="p-button-secondary" />
            <Button label="Success" className="p-button-success" />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        role: state.auth.role
    };
};

export default connect(mapStateToProps)(RoleSelector);