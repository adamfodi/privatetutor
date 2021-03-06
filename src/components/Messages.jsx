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
                summary: 'Nincs c??mzett!',
            })
        }

        if (subject.length === 0) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: 'Nincs t??rgy!',
            })
        }

        if (!messageContent) {
            errorToast.push({
                life: 5000,
                severity: 'error',
                summary: '??res ??zenet!',
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
                title: "??zenet k??ld??se...",
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
                        title: "Sikeres k??zbes??t??s!",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    })
                })
                .catch(() => {
                    Swal.fire({
                        didOpen: () => {
                            Swal.hideLoading();
                        },
                        icon: "error",
                        title: "Probl??ma t??rt??nt a k??zbes??t??s sor??n!\n K??rem pr??b??lja ??jra k??s??bb!",
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
            label="T??rl??s"
            className="p-button-danger"
            onClick={() => showIncomingMessages
                ? MessageService.deleteIncomingMessage(firebaseAuth.uid, rowData)
                : MessageService.deleteOutgoingMessage(firebaseAuth.uid, rowData)
            }
        />
    }

    return (
        <div className="messages-container">
            <p>??zenetek</p>
            <div>
                <div className="menu">
                    <Button
                        label="??j ??zenet"
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
                        label="Be??rkezett ??zenetek"
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
                        label="Elk??ld??tt ??zenetek"
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
                                <p>??j ??zenet</p>
                            </div>
                            <div>
                                <div className="addressee">
                                    <p>C??mzett</p>
                                    <Dropdown
                                        valueTemplate={addressee ? addressee.nameWithEmail : null}
                                        options={usersList.filter((user) => user.UID !== firebaseAuth.uid)}
                                        onChange={(e) => setAddressee(e.value)}
                                        optionLabel="nameWithEmail"
                                        filter
                                        filterBy="nameWithEmail"
                                        emptyFilterMessage="Nem tal??lhat?? ilyen felhaszn??l??."
                                        placeholder="..."
                                    />
                                    <div className={"clear"}>
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-danger"
                                            onClick={() => setAddressee(null)}
                                            disabled={!addressee}
                                        />
                                    </div>
                                </div>
                                <div className="subject">
                                    <p>T??rgy</p>
                                    <InputText
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="..."
                                    />
                                    <div className={"clear"}>
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-danger"
                                            onClick={() => setSubject("")}
                                            disabled={subject.length === 0}
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
                                        label="K??ld??s"
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
                                <p>{showIncomingMessages ? "Be??rkezett ??zenetek" : "Elk??ld??tt ??zenetek"}</p>
                            </div>
                            <div className="datatable-div">
                                <DataTable
                                    value={profile && showIncomingMessages ? profile.messages.incoming : profile.messages.outgoing}
                                    loading={!profile}
                                    responsiveLayout="scroll"
                                    emptyMessage={showIncomingMessages ? "Nincsenek be??rkezett ??zenetek." : "Nincsenek elk??ld??tt ??zenetek."}
                                    paginator
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                                    currentPageReportTemplate="??sszes ??zenet: {totalRecords}"
                                    rows={6}
                                    sortField="date"
                                    sortOrder={-1}
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
                header="??zenet megtekint??se"
                visible={showMessageDialog}
                position={"center"}
                modal
                onHide={() => {
                    if (messageDialogProperties.type === "incoming" && messageDialogProperties.message.read === false) {
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
                        setShowMessageDialog={setShowMessageDialog}
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