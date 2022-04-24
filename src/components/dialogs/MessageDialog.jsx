import React, {useRef, useState} from "react";
import "../../assets/css/dialogs/message-dialog.css"
import {Editor} from "primereact/editor";
import {editorHeader} from "../../util/FormFields";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import Swal from "sweetalert2";
import {MessageService} from "../../services/MessageService";
import {Toast} from "primereact/toast";
import moment from "moment";

const MessageDialog = (props) => {
    const {message, type, setShowMessageDialog} = props;
    const [showReadMessage, setShowReadMessage] = useState((type === "incoming" || type === "outgoing"));
    const [showSendMessage, setShowSendMessage] = useState(type === "sending");
    const [messageContent, setMessageContent] = useState(null);
    const errorToast = useRef(null);

    console.log(message)

    const validateMessage = () => {
        const errorToast = []

        if (!messageContent) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Üres üzenet!',
            })
        }
        return errorToast;
    }

    const sendMessage = () => {
        const toast = validateMessage();

        if (toast.length === 0) {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                title: "Üzenet küldése...",
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            const answer = {
                fromUID: message.toUID,
                fromName: message.toName,
                toUID: message.fromUID,
                toName: message.fromName,
                subject: "Válasz: " + message.subject,
                content: messageContent,
                date: new Date()
            }

            MessageService.sendMessage(answer)
                .then(() => {
                    setMessageContent(null)
                    Swal.fire({
                        didOpen: () => {
                            Swal.hideLoading();
                        },
                        timer: 1500,
                        icon: "success",
                        title: "Sikeres kézbesítés!",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    })
                        .then(() => setShowMessageDialog(false))
                })
                .catch((err) => {
                    console.log(err)
                    Swal.fire({
                        didOpen: () => {
                            Swal.hideLoading();
                        },
                        icon: "error",
                        title: "Probléma történt a kézbesítés során!\n Kérem próbálja újra később!",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                })
        } else {
            errorToast.current.show(toast);
        }
    }

    return (
        <>
            <div className="message-dialog-content">
                {
                    showReadMessage &&
                    <div className="read-message-div">
                        <div>
                            <p>
                                Feladó
                            </p>
                            <InputText
                                value={message.toName}
                                disabled
                            />
                        </div>
                        <div>
                            <p>
                                Tárgy
                            </p>
                            <InputText
                                value={message.subject}
                                disabled
                            />
                        </div>

                        <div className="date-div">
                            <p>
                                {moment(message.date.toDate()).format("YYYY. MMMM. Do hh:mm")}
                            </p>
                        </div>
                        <div className="content-div">
                            {
                                message.content &&
                                <div className="message">
                                    <Editor
                                        headerTemplate={editorHeader}
                                        value={message.content}
                                        readOnly
                                    />
                                </div>
                            }
                        </div>
                        {
                            type !== "outgoing" &&
                            <div className="answer-div">
                                <Button
                                    label="Válasz"
                                    onClick={() => setShowSendMessage(!showSendMessage)}
                                    className="p-button-success show-send-message-button"
                                />
                            </div>
                        }

                    </div>
                }

                {
                    showSendMessage &&
                    <div className="send-message-div">
                        <div>
                            <p>
                                Címzett
                            </p>
                            <InputText
                                value={message.toName}
                                disabled
                            />
                        </div>
                        <div>
                            <p>
                                Tárgy
                            </p>
                            <InputText
                                value={"Válasz: " + message.subject}
                                disabled
                            />
                        </div>
                        <div className="content-div">
                            {
                                message.content &&
                                <div className="message">
                                    <Editor
                                        headerTemplate={editorHeader}
                                        value={messageContent}
                                        onTextChange={(e) => setMessageContent(e.htmlValue)}
                                    />
                                </div>
                            }
                        </div>
                        <div className="send-message-button-div">
                            <Button
                                label="Küldés"
                                className="send-message-button"
                                onClick={() => sendMessage()}
                            />
                        </div>
                    </div>
                }

            </div>
            <Toast ref={errorToast}/>
        </>

    )
}


export default (MessageDialog);