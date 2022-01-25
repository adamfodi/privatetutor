import {connect} from "react-redux";

const Main = props => {
    const {role} = props;

    if (role === 'student') {
        return <div>Index for students!</div>
    }

    if (role === 'tutor') {
        return <div>Index for tutors!</div>
    }

    return (
        <div>Index for everyone!!!!!!!</div>
    );
}

const mapStateToProps = state => {
    return {
        role: state.user.role
    };
};

export default connect(mapStateToProps)(Main);