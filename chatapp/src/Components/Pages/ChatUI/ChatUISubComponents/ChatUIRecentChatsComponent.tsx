import React, { forwardRef, MouseEventHandler, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Twemoji } from "react-emoji-render";
import { http } from "../../../../Services/ApiServices/HttpClient/HttpClient";
import { socket } from "../../../../Services/ApiServices/SocketIOClient/Socket.IOClient";
import { AddContactModalComponent, ContactsModalComponent } from "../../../CommonComponents/Modals";
import { containEmojis, emptyChat, onInputChange, setDateFormat } from "../../../ComponentTSCode/CommonComponentTSCode";
import AuthContext from "../../../Context/AuthContext";

const ChatUIRecentsChatsComponent = forwardRef(({ ...props }:any, ref) => {

    const { authUser, setAuthUser } = useContext(AuthContext);

    const [searchChat, setSearchChat] = useState({ chatToSearch: '' });
    const [recentChats, setRecentChats] = useState<any>(undefined);
    const [selectedChat, setSelectedChat] = useState<any>(undefined);

    const contactsModalRef = useRef<any>();
    const addContactModalRef = useRef<any>();

    const chatUIRecentChatsRef = useRef<any>();

    React.useImperativeHandle(ref, () => {
        return {
            selectedChat: selectedChat,
            setSelectedChat: setSelectedChat
        }
    });

    useEffect(() => {                
        if (recentChats != undefined) return;
        if (authUser == undefined) return;
        //        if((recentChats as Array<any>).length > 0) return;
        (
            async () => {
                try {
                    const chats = await http.getWithTimeout(`/recentChats/${authUser.Id || authUser.id}`);
                    setRecentChats(chats);
                } catch (error) {
                    throw error;
                }
            }
        )();
    }, []);

    //renders begin
    const showRecentChats: Function = () => {
        if (recentChats == undefined) {
            const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            return (
                <div role="status" className="animate-pulse px-2 flex flex-col">

                    {count.map((c) => (
                        <div key={c} className="flex items-center">
                            <svg className="w-[70px] h-[70px] text-gray-200 dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
                            <div style={{ width: '82%' }} className="flex flex-col">
                                <div className="flex flex-row justify-between items-end">
                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-2"></div>
                                </div>
                                <div className="w-20 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                        </div>
                    ))}

                    <span className="sr-only">Loading...</span>
                </div>
            )
        }

        if (recentChats.length === 0) {
            return (
                <div className="flex items-center justify-center h-available text-xl">
                    <strong>No recent chats</strong>
                </div>
            );
        }
        return recentChats.map((chat: any) =>
            <a key={chat.Id} onClick={() => {
                setSelectedChat(chat)
                props.chatUIMessagingAreaRef.current.setSelectedChat(chat)
            }} className={
                `${selectedChat != undefined ? (selectedChat.Id === chat.Id ? 'bg-indigo-600 text-white' : '') : ''
                } cursor-pointer flex items-center py-2 px-4 w-full duration-200 hover:bg-indigo-600 hover:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white`
            }>
                <div id={chat.Id} className={`avatar ${chat.Id}avatar ${chat.ConnData.Status == 'Online'? 'online': ''} before:!shadow-[0 0 0 2px rgba(0, 0, 0, 0.3)] mr-2`}>
                    <div className="w-14 rounded-full h-auto">
                        <img src={chat.ProfilePhoto} className="" alt="photo" />
                    </div>
                </div>
                <div className="flex w-available" style={{ flexDirection: 'column' }}>
                    <div className="flex justify-between items-center">
                        <div className="text-[17px]"><strong>{chat.FullName}</strong></div>
                        <div className="text-xs">{setDateFormat(chat.LastMsgData.SendDate, 'recentChats')}</div>
                    </div>
                    <div className="flex justify-between items-start">
                        <div className={`text-sm w-available ${chat.Id}recentmsg`}>
                            {
                                chat.LastMsgData.Source.length === 0 ?
                                    chat.LastMsgData.Msg.length > 30 ? containEmojis(chat.LastMsgData.Msg) ? <Twemoji className="flex items-center" text={`${chat.LastMsgData.Msg.substr(0, 30)}...`} /> : `${chat.LastMsgData.Msg.substr(0, 30)}...` : containEmojis(chat.LastMsgData.Msg) ? <Twemoji className="flex items-center" text={chat.LastMsgData.Msg} /> : chat.LastMsgData.Msg
                                    : chat.LastMsgData.Source[0].FileMimetype.split('/')[0] === 'image' ?
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            {
                                                chat.LastMsgData.Msg === "none" ? "image"
                                                    : chat.LastMsgData.Msg.length > 30 ? containEmojis(chat.LastMsgData.Msg) ? <Twemoji className="flex items-center" text={`${chat.LastMsgData.Msg.substr(0, 30)}...`} /> : `${chat.LastMsgData.Msg.substr(0, 30)}...` : containEmojis(chat.LastMsgData.Msg) ? <Twemoji className="flex items-center" text={chat.LastMsgData.Msg} /> : chat.LastMsgData.Msg
                                            }
                                        </div>
                                        : chat.LastMsgData.Source[0].FileMimetype.split('/')[0] === 'video' ?
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                {
                                                    chat.LastMsgData.Msg === 'none' ? "video"
                                                        : chat.LastMsgData.Msg.length > 30 ? containEmojis(chat.LastMsgData.Msg) ? <Twemoji className="flex items-center" text={`${chat.LastMsgData.Msg.substr(0, 30)}...`} /> : `${chat.LastMsgData.Msg.substr(0, 30)}...` : containEmojis(chat.LastMsgData.Msg) ? <Twemoji className="flex items-center" text={chat.LastMsgData.Msg} /> : chat.LastMsgData.Msg
                                                }
                                            </div>
                                            : ''
                            }
                        </div>
                        <div className="flex items-center justify-center bg-indigo-500 rounded-full text-white p-[.5px] w-[23px] mr-1 ">
                            <p className="h-[20px] text-sm">N</p>
                        </div>
                        <div className="dropdown dropdown-end">
                            <button className="duration-200 font-medium rounded-full text-sm text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-lg w-[175px] p-2">
                                <li >
                                    <label onClick={(): MouseEventHandler => props.setPopupModalProps({ message: `Are you sure you want delete your chat with ${chat.FullName}?`, action: () => emptyChat(authUser.Id || authUser, selectedChat.Id) })} htmlFor="my-modal" className="modal-button text-black flex cursor-pointer rounded-lg py-2 px-4 hover:bg-red-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        <div>Delete chat</div>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        {/*<button className="text-gray-600  hover:text-indigo-600 font-medium rounded-full text-sm text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800" id="user-menu-button" aria-expanded="false" type="button" data-dropdown-toggle={chat.Id}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div className="hidden z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" id={chat.Id}>
                            <ul className="py-1" aria-labelledby="dropdown">
                                <li>
                                    <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Chat option</a>
                                </li>
                            </ul>
                        </div>*/}
                    </div>
                </div>
            </a>
        );
    };

    //renders end

    //socketIO event listeners begin
    socket.on('Update Chats', (data: any) => {
        if(recentChats == undefined) return;
       // if (recentChats.length === 0 || data === null) return getRecentChats(authUser.Id || authUser.id, setRecentChats);
        const temp: any[] = recentChats.slice();

        // if (temp.filter(chat => chat.Id === data.From || chat.Id === data.To).length === 0) {
        //     return getRecentChats(authUser.Id || authUser.id, setRecentChats);
        // }

        temp.filter(chat => chat.Id === data.From || chat.Id === data.To)[0].LastMsgData.Msg = data.Body;
        temp.filter(chat => chat.Id === data.From || chat.Id === data.To)[0].LastMsgData.SendDate = data.SendDate;

        setRecentChats(temp);
    });

    socket.on("Typing message", (from: string): void => {    
                    
        const element = document.getElementsByClassName(`${from}recentmsg`)[0];
        if(element != undefined) {            
            if(!element.parentElement?.parentElement?.parentElement?.classList.contains('bg-indigo-600')){
                element.classList.add('text-indigo-700');
            } 
            element.innerHTML = "Typing message...";
        }
        
       const element2 = document.getElementsByClassName(`${from}headermsgarea`)[0];
        if(element2 != undefined) {
            element2.classList.remove('text-indigo-700');
            element2.innerHTML = "Typing message...";
        }
    });

    socket.on("Message sended", (from: string, to: string): void => {
        const element3 = document.getElementsByClassName(`${from}headermsgarea`)[0];
        if(element3 != undefined) element3.innerHTML = "Online";
    });

    socket.on("No typing message", (from: string) => {
        if(recentChats == undefined) return;
        
        if (recentChats.filter((chat: any) => chat.Id === from).length === 0) return;

        const element = document.getElementsByClassName(`${from}recentmsg`)[0];
        if(element != undefined) {
            element.classList.remove('text-indigo-700');
            element.innerHTML = recentChats.filter((chat: any) => chat.Id === from)[0].LastMsgData.Msg;
        }

        const element2 = document.getElementsByClassName(`${from}headermsgarea`)[0];
        if(element2 != undefined) element2.innerHTML = "Online";
    });

    socket.on("Friend connected", (id: string) => {        
        if (recentChats == undefined) return;        

        const temp: any[] = recentChats.slice();        

        temp.filter((recentChats: any) => recentChats.Id === id)[0].ConnData.Status = "Online";

        const element = document.getElementsByClassName(`${id}avatar`)[0];
        if(element != undefined) element.classList.add('online');

        const element3 = document.getElementsByClassName(`${id}headermsgarea`)[0];
        
        if(element3 != undefined) {
            element3.classList.add('text-indigo-600')
            element3.innerHTML = "Online";
        }

        // const element4 = document.getElementsByClassName(`${id}modalcontact`)[0];

        // if(element4 != undefined) {
        //     element4.classList.add('text-indigo-600')
        //     element4.innerHTML = "Online";
        // }
        
        setRecentChats(temp);
    });

    socket.on("Friend disconnected", (id: string, date: Date) => {        
        if (recentChats == undefined) return;

        const temp: any[] = recentChats.slice();

        temp.filter((contact: any) => contact.Id === id)[0].ConnData.Status = "Offline";
        temp.filter((contact: any) => contact.Id === id)[0].ConnData.LastConn = date;

        const element = document.getElementsByClassName(`${id}avatar`)[0];
        if(element != undefined) element.classList.remove('online');

        const element3 = document.getElementsByClassName(`${id}headermsgarea`)[0];
        if(element3 != undefined) {
            element3.classList.replace('text-indigo-600', 'text-gray-500');    
            element3.innerHTML = `Offline(${new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })})`;
        }

        // const element4 = document.getElementsByClassName(`${id}modalcontact`)[0];

        // if(element4 != undefined) {
        //     element4.classList.replace('text-indigo-600', 'text-gray-500');    
        //     element4.innerHTML = `Offline(${new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })})`;
        // }

        setRecentChats(temp);
    });
    //socketIO event listeners end

    const getContacts = async () => {
        contactsModalRef?.current?.setShow(true);
        if (contactsModalRef?.current?.contacts != undefined && (contactsModalRef?.current?.contacts as Array<any>).length > 0) return;
        try {
            const contacts = await http.getWithTimeout(`/myContacts/${authUser.Id || authUser.id}`);
            contactsModalRef?.current?.setContacts(contacts)
        } catch (error) {

        }
    }

    //main renders
    return (
        <div className="flex w-[500px] text-black bg-gray-50 dark:bg-gray-700 dark:text-white md:flex" style={{ flexDirection: 'column' }}>
            {/*Search chat area*/}
            <div className="py-2 px-4 w-full border-b border-gray-200 flex justify-between">
                <div className="relative w-[85%]">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="text" id="email-adress-icon" value={searchChat.chatToSearch} onChange={(e) => onInputChange(e.target.value, "chatToSearch", searchChat, setSearchChat)} className="bg-white border border-gray-300 text-black rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Search chat" />
                </div>

                <div className="dropdown dropdown-bottom dropdown-start">
                    <button className="text-gray-500 rounded-xl border border-gray-300  hover:bg-indigo-600 hover:text-white font-medium text-sm p-2.5 text-center inline-flex items-center ">
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                    </button>
                    <ul tabIndex={0} className="dropdown-content menu shadow bg-white rounded-lg w-[200px] py-1" arial-abelledby="dropdownMenuIconHorizontalButton">
                        <li  >
                            <a type="button" onClick={getContacts} className="cursor-pointer text-center inline-flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <svg aria-hidden="true" className="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                Contacts
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/*Recent chats area */}
            <div id='chatsContainer' className="flex overflow-y-auto h-available" style={{ flexDirection: 'column' }}>
                {showRecentChats()}
            </div>
            <ContactsModalComponent ref={contactsModalRef} chatUIMessagingAreaRef={props.chatUIMessagingAreaRef} chatUIRecentChatsRef={ref} addContactModalRef={addContactModalRef} />
            <AddContactModalComponent ref={addContactModalRef} contactsModalRef={contactsModalRef} />
        </div>
    );
});

export default ChatUIRecentsChatsComponent;