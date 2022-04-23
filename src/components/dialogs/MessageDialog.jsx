import React, {useEffect, useRef, useState} from "react";
import "../../assets/css/dialogs/message-dialog.css"
import {Editor} from "primereact/editor";
import {editorHeader} from "../../util/FormFields";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

const MessageDialog = (props) => {
    const {message, type} = props;
    const [showReadMessage, setShowReadMessage] = useState((type === "incoming" || type === "outgoing"));
    const [showSendMessage, setShowSendMessage] = useState(type === "sending");
    const [messageContent, setMessageContent] = useState(null);

    console.log(message)
    console.log(type)
    console.log(showSendMessage)


    return (
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
                    <div>
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
                    <div>
                        <Button
                            label="Válasz"
                            onClick={() => setShowSendMessage(!showSendMessage)}
                            className="p-button-success show-send-message-button"
                        />
                    </div>
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
                            value={message.subject}
                            disabled
                        />
                    </div>
                    <div>
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
                            onClick={(e) => {} }
                        />
                    </div>
                </div>
            }
        </div>
    )
}


export default (MessageDialog);