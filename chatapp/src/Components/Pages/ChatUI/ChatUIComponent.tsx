import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Services/CustomHooks/AuthProvider";
import ChatUIContactsComponent from "./ChatUISubComponents/ChatUIContactsComponent";
import ChatUIMessagingAreaComponent from "./ChatUISubComponents/ChatUIMessagingAreaComponent";
import ChatUINavComponent from "./ChatUISubComponents/ChatUINavComponent";
import ChatUIRecentsChatsComponent from "./ChatUISubComponents/ChatUIRecentChatsComponent";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { http } from "../../../Services/ApiServices/HttpClient/HttpClient";
import { FilesModal, ForwardModal, PopupModal } from "../../CommonComponents/Modals";

const ChatUIComponent: any = ({ ...props }) => {

    let isLoggedIn:any = useAuth()[0];
    let navigate: any = useNavigate();
    let token:any = localStorage.getItem('UserToken');
    let user:any = (token != undefined ? jwtDecode<JwtPayload>(token): null);

    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [popupModalProps, setPopupModalProps] = useState<any>({
        message: '',
        action: () => {console.log("working")}
    });
    const [contacts, setContacts] = useState([]);
    const [messageToForward, setMessageToForward] = useState<any>({});
    const [filesToSend, setFilesToSend] = useState([]);


    useEffect(() => {
        if(isLoggedIn === false) navigate('/signIn');

        return () => {
            isLoggedIn = null;
            navigate = null;
        };
    }, [isLoggedIn, messageToForward, filesToSend]);

    return (
        <div className="h-screen overflow-hidden">
            <ChatUINavComponent user={user} http={http} socket={props.socket}/>
            <div className="flex divide-x h-b2 md:h-b" >
                <ChatUIRecentsChatsComponent userid={user != null ?  user.Id: null} http={http} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setPopupModalProps={setPopupModalProps} socket={props.socket}/>
                <ChatUIMessagingAreaComponent userid={user != null ?  user.Id: null} http={http} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setPopupModalProps={setPopupModalProps} socket={props.socket} setMessageToForward={setMessageToForward} setFilesToSend={setFilesToSend}/>
                <ChatUIContactsComponent userid={user != null ?  user.Id: null} http={http} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setContacts={setContacts} socket={props.socket}/>
            </div>
            <PopupModal message={popupModalProps.message} action={popupModalProps.action}/>
            <ForwardModal userid={user != null ?  user.Id: null} contacts={contacts} setContacts={setContacts} selectedChat={selectedChat} setSelectedChat={setSelectedChat} messageToForward={messageToForward} http={http}/>
            <FilesModal userid={user != null ?  user.Id: null} selectedChat={selectedChat} filesToSend={filesToSend} setFilesToSend={setFilesToSend} http={http}/>

        </div>
    );
};

export default ChatUIComponent;