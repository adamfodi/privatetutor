import React, {useState} from "react";
import "../../assets/css/dialogs/feedback-dialog.css"
import {InputTextarea} from "primereact/inputtextarea";
import {Rating} from "primereact/rating";
import {Button} from "primereact/button";
import {UserService} from "../../services/UserService";
import Swal from "sweetalert2";
import {connect} from "react-redux";
import {PrivateLessonService} from "../../services/PrivateLessonService";

const FeedbackDialog = (props) => {
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackRating, setFeedbackRating] = useState(5);

    const sendFeedback = () => {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Küldés...",
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        const feedback = {
            message: feedbackMessage,
            rating: feedbackRating,
            fromUID: props.firebaseAuth.uid,
            date: new Date()

        }
        UserService.addFeedback(props.feedbackUID, feedback)
            .then(() => {
                PrivateLessonService.modifyPrivateLessonFeedback(props.privateLessonID, props.role)
                    .then(() => {
                        Swal.fire({
                            didOpen: () => {
                                Swal.hideLoading();
                            },
                            timer: 1500,
                            icon: "success",
                            title: "Sikeres küldés!",
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        })
                            .then(() => props.setShowFeedbackDialog(false))
                    })
            })
            .catch(() => {
                Swal.fire({
                    didOpen: () => {
                        Swal.hideLoading();
                    },
                    icon: "error",
                    title: "Probléma történt!\n Kérem próbálja újra később!",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                    .then(() => props.setShowFeedbackDialog(false))
            })
    }

    return (
        <div className="feedback-dialog-content">
            <div>
                <InputTextarea
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Ide írd az értékelést... (Nem kötelező kitölteni)"
                />
                <Rating
                    value={feedbackRating}
                    cancel={false}
                    stars={10}
                    onChange={(e) => setFeedbackRating(e.value)}
                />
            </div>
            <div>
                <Button
                    label="Küldés"
                    onClick={() => sendFeedback()}

                />
            </div>
        </div>

    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
    };
};

export default connect(mapStateToProps)(FeedbackDialog);