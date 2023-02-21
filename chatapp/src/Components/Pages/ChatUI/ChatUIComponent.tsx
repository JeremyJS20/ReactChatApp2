import { useRef, useState } from "react";
import ChatUIMessagingAreaComponent from "./ChatUISubComponents/ChatUIMessagingAreaComponent";
import ChatUINavComponent from "./ChatUISubComponents/ChatUINavComponent";
import ChatUIRecentsChatsComponent from "./ChatUISubComponents/ChatUIRecentChatsComponent";
import { ContactsModalComponent, FilesModal, ForwardModal, PopupModal } from "../../CommonComponents/Modals";

const ChatUIComponent: any = ({ ...props }) => {

    const [popupModalProps, setPopupModalProps] = useState<any>({
        message: '',
        action: () => { console.log("working") }
    });

    const [messageToForward, setMessageToForward] = useState<any>({});
    const [filesToSend, setFilesToSend] = useState([]);

    const chatUIMessagingAreaRef = useRef<any>();
    const chatUIRecentChatsRef = useRef<any>();

    return (
        <div className="h-screen overflow-hidden">
            <div className="flex divide-x h-available" >
                <ChatUINavComponent/>
                <ChatUIRecentsChatsComponent ref={chatUIRecentChatsRef} chatUIMessagingAreaRef={chatUIMessagingAreaRef} setPopupModalProps={setPopupModalProps} />
                <ChatUIMessagingAreaComponent ref={chatUIMessagingAreaRef} setPopupModalProps={setPopupModalProps} setMessageToForward={setMessageToForward} setFilesToSend={setFilesToSend} />
            </div>
            {/* <PopupModal message={popupModalProps.message} action={popupModalProps.action}/>
            <ForwardModal userid={user != null ?  user.Id: null} contacts={contacts} setContacts={setContacts} selectedChat={selectedChat} setSelectedChat={setSelectedChat} messageToForward={messageToForward} http={http}/>
            <FilesModal userid={user != null ?  user.Id: null} selectedChat={selectedChat} filesToSend={filesToSend} setFilesToSend={setFilesToSend} http={http}/> */}
        </div>
    );
};

export default ChatUIComponent;