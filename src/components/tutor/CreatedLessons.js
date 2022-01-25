import React from "react";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

const CreatedLessons = props => {
    const {lessons, auth} = props;

    console.log("LESSONS")
    console.log(lessons)

    return (
        <div>
            OLDALADLADADL
            {/*<div className="row">*/}
            {/*    <div className="col s12 m6">*/}
            {/*        <ProjectList projects={projects} />*/}
            {/*    </div>*/}
            {/*    <div className="col s12 m5 offset-m1">*/}
            {/*        <Notifications />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

const mapStateToProps = state => {
    // console.log(state);
    return {
        lessons: state.firestore.ordered.lessons,
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "lessons"}])
)(CreatedLessons);
