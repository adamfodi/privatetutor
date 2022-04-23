import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {compose} from "redux";
import "../assets/css/messages.css"
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {firestoreConnect} from "react-redux-firebase";
import {InputText} from "primereact/inputtext";
import {editorHeader} from "../util/FormFields";
import {Editor} from "primereact/editor";
import {MessageService} from "../services/MessageService";
import Swal from "sweetalert2";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Toast} from "primereact/toast";
import moment from "moment";
import {Badge} from "primereact/badge";
import {Dialog} from "primereact/dialog";
import MessageDialog from "./dialogs/MessageDialog";

const Messages = props => {
    const {firebaseAuth, users, profile} = props;
    const [usersList, setUsersList] = useState([]);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [showIncomingMessages, setShowIncomingMessages] = useState(true);
    const [showOutgoingMessages, setShowOutgoingMessages] = useState(false);
    const [addressee, setAddressee] = useState(null);
    const [subject, setSubject] = useState("");
    const [messageContent, setMessageContent] = useState(null);
    const [showMessageDialog, setShowMessageDialog] = useState(false);
    const [messageDialogProperties, setMessageDialogProperties] = useState(null);
    const errorToast = useRef(null);

    moment.locale('hu')

    useEffect(() => {
        if (users) {
            const _userList = users.map((user) => {
                return {
                    nameWithEmail: user.profile.personalData.fullName + ' - ' + user.profile.personalData.email,
                    uid: user.id,
                    name: user.profile.personalData.fullName
                }
            })
            setUsersList(_userList.filter(user => user.uid !== firebaseAuth.uid));
        }
    }, [firebaseAuth.uid, users])

    const countUnreadIncomingMessages = () => {
        return profile
            ? profile.messages.incoming.filter(message => message.read === false).length
            : 0
    }

    const validateMessage = () => {
        const errorToast = []

        if (!addressee) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Nincs címzett!',
            })
        }

        if (subject.length === 0) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Nincs tárgy!',
            })
        }

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

            const message = {
                fromUID: firebaseAuth.uid,
                fromName: profile.profile.personalData.fullName,
                toUID: addressee.uid,
                toName: addressee.name,
                subject: subject,
                content: messageContent,
                date: new Date()
            }

            MessageService.sendMessage(message)
                .then(() => {
                    setAddressee(null)
                    setSubject("")
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

    const nameBodyTemplate = (rowData) => {
        return <p className={rowData.read === false ? "unread" : undefined}>
            {showIncomingMessages ? rowData.fromName : rowData.toName}
        </p>
    }

    const subjectBodyTemplate = (rowData) => {
        return <p className={rowData.read === false ? "unread" : undefined}>
            {rowData.subject}
        </p>
    }

    const dateBodyTemplate = (rowData) => {
        return <p className={rowData.read === false ? "unread" : undefined}>
            {moment(rowData.date.toDate()).format("MMM Do")}
        </p>
    }

    const deleteMessageBodyTemplate = (rowData) => {
        return <Button
            label="Törlés"
            className="p-button-danger"
            onClick={() => showIncomingMessages
                ? MessageService.deleteIncomingMessage(firebaseAuth.uid, rowData)
                : MessageService.deleteOutgoingMessage(firebaseAuth.uid, rowData)
            }
        />
    }

    return (
        <div className="messages-container">
            <p>Üzenetek</p>
            <div>
                <div className="menu">
                    <Button
                        label="Új üzenet"
                        className={showNewMessage ? "active-button p-button-success" : undefined}
                        onClick={() => {
                            setShowIncomingMessages(false)
                            setShowOutgoingMessages(false)
                            setAddressee(null)
                            setSubject("")
                            setMessageContent(null)
                            setShowNewMessage(true)
                        }}
                    />
                    <Button
                        label="Beérkezett üzenetek"
                        className={showIncomingMessages ? "active-button p-button-success" : undefined}
                        onClick={() => {
                            setShowNewMessage(false)
                            setShowOutgoingMessages(false)
                            setShowIncomingMessages(true)
                        }}
                    >
                        {
                            countUnreadIncomingMessages() !== 0 &&
                            <Badge
                                value={countUnreadIncomingMessages()}
                                severity="danger"
                            />
                        }
                    </Button>
                    <Button
                        label="Elküldött üzenetek"
                        className={showOutgoingMessages ? "active-button p-button-success" : undefined}
                        onClick={() => {
                            setShowNewMessage(false)
                            setShowIncomingMessages(false)
                            setShowOutgoingMessages(true)
                        }}
                    />
                </div>
                <div className="messages">
                    {
                        showNewMessage &&
                        <div className="new-message-div">
                            <div>
                                <p>Új üzenet</p>
                            </div>
                            <div>
                                <div className="addressee">
                                    <p>Címzett</p>
                                    <Dropdown
                                        valueTemplate={addressee ? addressee.nameWithEmail : null}
                                        options={usersList.filter((user) => user.UID !== firebaseAuth.uid)}
                                        onChange={(e) => setAddressee(e.value)}
                                        optionLabel="nameWithEmail"
                                        filter
                                        filterBy="nameWithEmail"
                                        emptyFilterMessage="Nem található ilyen felhasználó."
                                        placeholder="..."
                                    />
                                    <div className={"clear"}>
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-danger"
                                            tooltip="Törlés"
                                            onClick={() => setAddressee(null)}
                                        />
                                    </div>
                                </div>
                                <div className="subject">
                                    <p>Tárgy</p>
                                    <InputText
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="..."
                                    />
                                    <div className={"clear"}>
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-danger"
                                            tooltip="Törlés"
                                            onClick={() => setSubject("")}
                                        />
                                    </div>
                                </div>
                                <div className="message-content">
                                    <Editor
                                        headerTemplate={editorHeader}
                                        value={messageContent}
                                        onTextChange={(e) => setMessageContent(e.htmlValue)}
                                    />
                                </div>
                                <div className="button-div">
                                    <Button
                                        label="Küldés"
                                        className="new-message-button"
                                        onClick={() => sendMessage()}
                                    />
                                </div>
                            </div>
                        </div>
                    }

                    {
                        (showIncomingMessages || showOutgoingMessages) &&
                        <div className="messages-div">
                            <div>
                                <p>{showIncomingMessages ? "Beérkezett üzenetek" : "Elküldött üzenetek"}</p>
                            </div>
                            <div className="datatable-div">
                                <DataTable
                                    value={profile && showIncomingMessages ? profile.messages.incoming : profile.messages.outgoing}
                                    loading={!profile}
                                    responsiveLayout="scroll"
                                    emptyMessage={showIncomingMessages ? "Nincsenek beérkezett üzenetek." : "Nincsenek elküldött üzenetek."}
                                    paginator
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                                    currentPageReportTemplate="Összes üzenet: {totalRecords}"
                                    rows={6}
                                    onRowClick={(e) => {
                                        if (profile && showIncomingMessages && profile.messages.incoming.length !== 0) {
                                            setMessageDialogProperties(
                                                {
                                                    message: e.data,
                                                    type: "incoming"
                                                }
                                            );
                                            setShowMessageDialog(true)
                                        }
                                        if (profile && showOutgoingMessages && profile.messages.outgoing.length !== 0) {
                                            setMessageDialogProperties(
                                                {
                                                    message: e.data,
                                                    type: "outgoing"
                                                }
                                            );
                                            setShowMessageDialog(true)
                                        }
                                    }}
                                >
                                    <Column
                                        field={showIncomingMessages ? "fromName" : "toName"}
                                        body={nameBodyTemplate}
                                        sortable
                                    />

                                    <Column
                                        field="subject"
                                        body={subjectBodyTemplate}
                                    />

                                    <Column
                                        field="date"
                                        body={dateBodyTemplate}
                                        sortable
                                    />

                                    <Column
                                        body={deleteMessageBodyTemplate}
                                    />
                                </DataTable>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Dialog
                header="Üzenet megtekintése"
                visible={showMessageDialog}
                position={"center"}
                modal
                onHide={() => {
                    if (messageDialogProperties.message.type === "incoming" && messageDialogProperties.message.read === false) {
                        MessageService.setIncomingMessageRead(firebaseAuth.uid, messageDialogProperties.message)
                            .catch(() => {
                            })
                    }
                    setMessageDialogProperties(null)
                    setShowMessageDialog(false)
                }}
                resizable={false}
                draggable={false}
                className="message-dialog"
            >
                {
                    messageDialogProperties &&
                    <MessageDialog
                        message={messageDialogProperties.message}
                        type={messageDialogProperties.type}
                    />
                }
            </Dialog>
            <Toast ref={errorToast}/>

        </div>
    );
};

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        users: state.firestore.ordered.users,
        profile: !state.firebase.auth.isEmpty && !state.firebase.profile.isEmpty
            ? state.firebase.profile
            : null
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection: "users"}])
)(Messages);