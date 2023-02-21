import React, { forwardRef, MouseEventHandler, useCallback, useContext, useEffect, useRef, useState } from "react";
import { containEmojis, deleteMessage, emptyChat, onFormSubmitted, onInputChange } from "../../../ComponentTSCode/CommonComponentTSCode";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';
import { Twemoji } from "react-emoji-render";
import { socket } from "../../../../Services/ApiServices/SocketIOClient/Socket.IOClient";
import AuthContext from "../../../Context/AuthContext";
import { http } from "../../../../Services/ApiServices/HttpClient/HttpClient";

interface INoReply {
    IdMsg: string | null,
    BodyMsg: string,
    From: string,
    FullName: string
}

const ChatUIMessagingAreaComponent = forwardRef(({ ...props }: any, ref) => {

    React.useImperativeHandle(ref, () => {
        return {
            selectedChat: selectedChat,
            setSelectedChat: setSelectedChat
        }
    });

    const { authUser, setAuthUser } = useContext(AuthContext);

    const [selectedChat, setSelectedChat] = useState<any>(undefined);

    const [message, setMessage] = useState({ messageToSend: '' });
    const [messages, setMessages] = useState<any>(undefined);
    const [messageToReply, setMessageToReply] = useState<INoReply>({
        IdMsg: null,
        BodyMsg: '',
        From: '',
        FullName: ''
    });

    const divDates: string[] = [];
    let divUnreadMessages: boolean = false;

    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach((entry) => {
    //         if(!entry.isIntersecting) return;

    //         console.log(messagesRef.current.indexOf(entry.target));
    //         if(messagesRef.current.indexOf(entry.target) == 0){
    //             if (selectedChat != null) getMessagesOnIntersectionObserver();
    //         }
    //         observer.unobserve(entry.target);
    //     });
    // }, {
    //     threshold: 1,
    //     rootMargin: '100px 0px 100px 0px'
    // });

    const messagingContainerRef: any = useRef();
    const unreadMessageRef: any = useRef();

    const messagesRef: any = useRef();


    // useEffect(() => {
    //     if (selectedChat != null && localStorage.getItem('currentChat') != selectedChat.Id) {
    //         localStorage.setItem('currentChat', selectedChat.Id);
    //         setIsloading(true);
    //     }
    //     if (selectedChat != null) getMessages(setMessages);

    //     return () => {
    //         setMessageToReply({
    //             IdMsg: null,
    //             BodyMsg: '',
    //             From: '',
    //             FullName: ''
    //         });
    //         setMessages([]);
    //         setMessage({ messageToSend: '' });
    //     };
    // }, []);

    useEffect(() => {
       if(selectedChat == undefined) return;
       (
        async () => {
            try {
                const selectedChatMessages = await http.get(`/selectedChatMessages/${authUser.Id || authUser.id}-${selectedChat.Id}`);

                setMessages(selectedChatMessages);
                messagingContainerRef.current.scroll({
                    top: messagingContainerRef.current.scrollHeight,
                    behavior: 'auto',
                });
            } catch (error) {
                throw error
            }
        }
    )()
    }, [selectedChat]);

    // useEffect(() => {
    //     messagesRef.current = Array.from(document.querySelectorAll('.message'));
    //     document.querySelectorAll('.message').forEach((entry:any) => {
    //         observer.observe(entry);
    //     })
    // }, [isLoading, messages]);


    // const getMessagesOnIntersectionObserver: Function = async () => {
    //     const s = await http.get(`/selectedChatMessages/${authUser.Id || authUser.id}-${selectedChat.Id}/${messages.length}`);

    //     const temp: any[] = [...s, ...messages]

    //     setMessages(temp);
    // };

    //sendind message to api
    const handleMessageSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            if (message.messageToSend === '') return;

        if (messageToReply.IdMsg != null) return ReplyMessage(message.messageToSend);

        const result: any = await http.post('/sendMessage', {
            from: authUser.Id || authUser.id,
            to: selectedChat.Id,
            msg: message.messageToSend
        });

        //if (result._id === undefined) throw result;

        messages.push(result);
        
        setMessage({ ...message, messageToSend: '' });

        messagingContainerRef.current.scroll({
            top: messagingContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
        } catch (error) {
            throw error
        }
    }, [authUser, selectedChat, message, messages]);

    const ReplyMessage: Function = async (msg: any) => {
        const result = await http.post('/ReplyMessage', {
            From: authUser.Id || authUser.id,
            To: selectedChat.Id,
            Body: msg,
            IdReplyMessage: messageToReply.IdMsg,
        });
        messages.push(result)
        setMessageToReply({
            IdMsg: null,
            BodyMsg: '',
            From: '',
            FullName: ''
        });
        setMessage({ ...message, messageToSend: '' })
    };

    //renders begin
    const showMessages: Function = () => {
        if (messages === undefined) {
            return (
                <div className="flex h-available items-center justify-center" style={{ flexDirection: 'column' }}>
                    <svg role="status" className="inline mr-2 w-[50px] h-auto text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            );
        }

        if (messages.length === 0) {
            return (
                <div className="flex h-available items-center justify-center text-xl text-black">
                    <strong>Type some message to start a conversation</strong>
                </div>
            );
        }
console.log(messages);

        return messages.map((message: any) =>
            authUser != undefined && (message.From === (authUser.Id || authUser.id) ? msg(message, {
                colors: 'bg-indigo-600 text-white',
                orientation: 'justify-end',
                dropdownOrientation: 'dropdown-end'
            }) : msg(message, {
                colors: '',
                orientation: 'justify-start',
                dropdownOrientation: 'dropdown-start'
            }))
        );
    };

    const divMessageByDates: Function = (sendDate: string) => {
        if (divDates.indexOf(new Date(sendDate).toLocaleDateString("en-US")) != -1) return;

        divDates.push(new Date(sendDate).toLocaleDateString("en-US"));

        return (
            <div className="flex justify-center ">
                <div className="bg-gray-50 text-black rounded-full border mb-4 mt-2 shadow-xl p-2">
                    {new Date(sendDate).getDate() === new Date().getDate()
                        ? "Today"
                        : new Date().getDate() -
                            new Date(sendDate).getDate() ===
                            1
                            ? "Yesterday"
                            : new Date().getFullYear() ===
                                new Date(sendDate).getFullYear()
                                ? new Date(sendDate).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                })
                                : new Date(sendDate).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                </div>
            </div>
        );
    };

    const unreadMessages: Function = (msg: any) => {
        if (msg.From === authUser.Id || authUser.id) return;
        if (divUnreadMessages === true) return;

        if (msg.Unread === true) {
            divUnreadMessages = true;

            return (
                <div ref={unreadMessageRef} id="unreadMessages" className="flex justify-center ">
                    <div className="bg-gray-50 text-center w-available text-black rounded-full border mb-4 mt-2 shadow-xl p-2">
                        Unread messages
                    </div>
                </div>
            );
        }
    };

    const showSourceMsg: Function = (message: any): JSX.Element => {
        if (message.Source.length === 1) {
            if (message.Source[0].FileMimetype.split('/')[0] === 'image') {
                return (
                    <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[0].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                );
            }

            if (message.Source[0].FileMimetype.split('/')[0] === 'video') {
                return (
                    <video controls onClick={(e: any) => console.log('klk')} className="w-[300px] h-auto cursor-pointer">
                        <source
                            src={`${process.env.REACT_APP_SOCKETIO_URL}videos/${message.Source[0].FileName}`}
                            type={message.Source[0].FileMimetype}
                        />
                        <p>Your browser doesn't support HTML5 video.</p>
                    </video>
                );
            }

            return (<div></div>)
        }
        if (message.Source.length === 2 || message.Source.length === 3) {
            if (message.Source[0].FileMimetype.split('/')[0] === 'image') {
                return message.Source.map((s: any) =>
                    <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${s.FileName}`} onClick={(e: any) => console.log('klk')} className="w-[110px] h-auto cursor-pointer" />
                );
            }

            if (message.Source[0].FileMimetype.split('/')[0] === 'video') {
                return message.Source.map((s: any) =>
                    <video controls onClick={(e: any) => console.log('klk')} className="w-[300px] h-auto cursor-pointer">
                        <source
                            src={`${process.env.REACT_APP_SOCKETIO_URL}videos/${message.Source[0].FileName}`}
                            type={message.Source[0].FileMimetype}
                        />
                        <p>Your browser doesn't support HTML5 video.</p>
                    </video>
                );
            }

            return (<div></div>)
        }
        if (message.Source.length === 4) {
            if (message.Source[0].FileMimetype.split('/')[0] === 'image') {
                return (
                    <div className="flex">
                        <div>
                            <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[0].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                            <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[2].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                        </div>
                        <div>
                            <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[1].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                            <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[3].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                        </div>
                    </div>
                );
            }

            /*if (message.Source[0].FileMimetype.split('/')[0] === 'video') {
                return message.Source.map((s: any) =>
                    <video controls onClick={(e: any) => console.log('klk')} className="w-[300px] h-auto cursor-pointer">
                        <source
                            src={`${process.env.REACT_APP_SOCKETIO_URL}videos/${message.Source[0].FileName}`}
                            type={message.Source[0].FileMimetype}
                        />
                        <p>Your browser doesn't support HTML5 video.</p>
                    </video>
                );
            }*/

            return (<div></div>)
        }

        if (message.Source.length >= 5) {
            if (message.Source[0].FileMimetype.split('/')[0] === 'image') {
                return (
                    <div className="flex">
                        <div>
                            <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[0].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                            <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[2].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                        </div>
                        <div>
                            <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[1].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                            <a className="cursor-pointer" onClick={(e: any) => console.log('klk')}>
                                <div className="relative text-center">
                                    <img src={`${process.env.REACT_APP_SOCKETIO_URL}img/${message.Source[3].FileName}`} onClick={(e: any) => console.log('klk')} className="w-[140px] h-auto cursor-pointer" />
                                    <div className="absolute w-full h-full flex justify-center items-center top-0 rounded-lg" style={{ background: 'rgba(0,0,0,.5)' }}>
                                        <div className="w-available">{message.Source.length - 3}+ photos</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                );
            }

            /*if (message.Source[0].FileMimetype.split('/')[0] === 'video') {
                return message.Source.map((s: any) =>
                    <video controls onClick={(e: any) => console.log('klk')} className="w-[300px] h-auto cursor-pointer">
                        <source
                            src={`${process.env.REACT_APP_SOCKETIO_URL}videos/${message.Source[0].FileName}`}
                            type={message.Source[0].FileMimetype}
                        />
                        <p>Your browser doesn't support HTML5 video.</p>
                    </video>
                );
            }*/

            return (<div></div>);
        }

        return <div></div>
    };

    const msg: Function = (message: any, attributes: any): JSX.Element => {
        return (
            <div key={message._id}>
                {divMessageByDates(message.SendDate)}
                {unreadMessages(message)}
                <div className={`flex ${attributes.orientation} mb-2 message`} >
                    <div className={`max-w-[375px] p-1 flex border border-indigo-600 rounded-lg shadow-xl ${attributes.colors}`} style={{ flexDirection: 'column', position: 'relative' }}>
                        { /* Message forwarded */
                            message.IsForwarding ?
                                <div className="break-all text-xs italic">
                                    <strong>Forwarded</strong>
                                </div>
                                : ''
                        }
                        {/* Message replied */
                            message.IsReplying ?
                                <div className="flex bg-indigo-800 rounded-lg p-1 text-xs text-white italic" style={{ flexDirection: 'column' }}>
                                    <div>
                                        <strong>{message.IsReplyingInfo.IdSender === authUser.Id || authUser.id ? 'You' : selectedChat.FullName}</strong>
                                    </div>
                                </div>
                                : ''
                        }
                        {/* Resources area */}
                        <div className="flex justify-center">
                            {showSourceMsg(message)}
                        </div>

                        {/* Message area */}
                        <div className={`break-all text-base flex items-end justify-between ${message.Body === 'none' ? 'absolute bottom-1 right-1' : ''}`} style={{ flexDirection: 'column' }}>

                            <div className="flex justify-between items-center w-full">
                                <div className="mr-2 w-available">
                                    {
                                        message.Body === 'none' ? '' :
                                            containEmojis(message.Body) ?
                                                <Twemoji className="flex items-center" text={message.Body} />
                                                : message.Body
                                    }
                                </div>
                                <div className={`dropdown ${attributes.dropdownOrientation}`} style={{ width: '20px' }}>
                                    <button className="duration-200 font-medium rounded-full text-sm text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                    <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-lg w-[220px] p-2">
                                        <li>
                                            <label onClick={(): MouseEventHandler => Reply(message)} className="text-black flex cursor-pointer rounded-lg py-2 px-4 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                                <div>Reply message</div>
                                            </label>
                                        </li>
                                        <li>
                                            <label onClick={(): MouseEventHandler => Forward(message)} htmlFor="forwardModal" className="modal-button text-black flex cursor-pointer rounded-lg py-2 px-4 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                <div>Forward message</div>
                                            </label>
                                        </li>
                                        <li>
                                            <label onClick={(): MouseEventHandler => props.setPopupModalProps({ message: `Are you sure you want delete this message?`, action: () => deleteMessage(message._id, authUser.Id || authUser.id) })} htmlFor="my-modal" className="modal-button text-black flex cursor-pointer rounded-lg py-2 px-4 hover:bg-red-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                <div>Delete message</div>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex justify-end text-xs text-right" style={{ flexDirection: 'column', width: '52px' }}>{new Date(message.SendDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //renders end

    //socketIO event listeners begins
    // socket.on('Update Messages', (data: any, from: string) => {
    //     if (data === null) return getMessages(authUser.Id || authUser.id, selectedChat.Id, setMessages);
    //     if (typeof (data) != 'object' && from != 'deletedMessage' && localStorage.getItem("currentChat") != data.From) return;

    //     var temp: any[] = messages.slice();
    //     if (from == 'deletedMessage') {
    //         setMessages(temp.filter((msg: any) => msg._id != data._id))
    //     } else if (from == 'emptyChat') {
    //         setMessages([]);
    //     } else {
    //         temp.push(data);
    //     }
    //     //setMessages(temp);

    //     messagingContainerRef.current.scroll({
    //         top: messagingContainerRef.current.scrollHeight,
    //         behavior: 'auto',
    //     });
    // });
    //socketIO event listeners end

    //onMessageInput events
    const onSelectEmoji: Function = (emoji: any): void => {
        setMessage({ messageToSend: `${message.messageToSend} ${emoji.native}` });
    }

    const onMessageInput: Function = (e: any) => {
        if (e.target.value.length === 0) return socket.emit('No typing message', selectedChat.Id, authUser.Id || authUser.id);
        socket.emit('Typing message', selectedChat.Id, authUser.Id || authUser.id);
    }

    //others
    const Reply: Function = (msg: any) => {
        setMessageToReply({
            IdMsg: msg._id,
            BodyMsg: (msg.Body.length > 50 ? containEmojis(msg.Body) ? <Twemoji className="flex items-center" text={`${msg.Body.substr(0, 30)}...`} /> : `${msg.Bodysubstr(0, 50)}...` : containEmojis(msg.Body) ? <Twemoji className="flex items-center" text={msg.Body} /> : msg.Body),
            From: msg.From,
            FullName: (msg.From === authUser.Id || authUser.id ? 'Tu' : selectedChat.FullName)
        });
    };

    const noReply: MouseEventHandler = (e: any) => {
        setMessageToReply({
            IdMsg: null,
            BodyMsg: '',
            From: '',
            FullName: ''
        });
    };

    const Forward: Function = (msg: any) => {
        props.setMessageToForward(msg)
    };

    //main render
    if (selectedChat === undefined) {
        return (
            <div className="w-available flex items-center justify-center bg-gray-50" style={{ flexDirection: 'column' }}>
                <svg className="w-[150px] h-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <div className="text-xl text-black text-center mb-[100px] mx-5">
                    <strong>Start a conversation selecting a chat</strong>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white w-available flex justify-between" style={{ flexDirection: "column" }}>

            {/*Chat info area */}
            <div className="bg-gray-50 flex items-center justify-between border-b border-gray-200 p-[9px] md:px-[20px] md:py-[7px]">

                {/* Selected chat profilephoto, fullname and status */}
                <div className="w-available flex items-center">
                    <img src={selectedChat.ProfilePhoto} className="w-12 mr-2 rounded-full h-auto" alt="photo" />
                    <div className="w-available flex" style={{ flexDirection: 'column' }}>
                        <div className="text-black font-semibold">{selectedChat.FullName}</div>
                        <div className={`${selectedChat.Id}headermsgarea text-sm ${selectedChat.ConnData.Status === 'Online' ? 'text-indigo-600': 'text-gray-500'}`}>
                            {
                                selectedChat.ConnData.Status === 'Online' ? 'Online' : `Offline(${new Date(selectedChat.ConnData.LastConn).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })})`
                            }
                        </div>
                    </div>
                </div>

                {/* Selected chat options */}
                <div className="flex justify-end">
                    <button type="button" className="text-gray-600  hover:text-indigo-600 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                    <div className="dropdown dropdown-end ">
                        <button className="text-gray-600 duration-200 hover:text-indigo-600 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                        </button>
                        <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-lg w-[175px] p-2">
                            <li className=''>
                                <label onClick={(): MouseEventHandler => props.setPopupModalProps({ message: `Are you sure you want delete your chat with ${selectedChat.FullName}?`, action: () => emptyChat(authUser.Id || authUser.id, selectedChat.Id) })} htmlFor="my-modal" className="modal-button text-black flex cursor-pointer rounded-lg py-2 px-4 hover:bg-red-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <div>Delete chat</div>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/*Chat messaging area */}
            <div id="messageContainer" ref={messagingContainerRef} className="h-available lock flex px-[150px] overflow-y-auto" style={{ flexDirection: 'column' }}>
                {showMessages()}
            </div>

            {/* Reply message area */}
            <div className={`flex justify-between items-center px-[20px] py-2 bg-gray-50 border-t ${messageToReply.IdMsg === null ? 'hidden' : ''}`}>
                <div className="flex items-center w-available">
                    <div className="text-indigo-600 mr-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                    <div className="flex w-available bg-indigo-600 rounded-lg p-2 text-white" style={{ flexDirection: 'column' }}>
                        <div className=""><strong>{messageToReply.FullName}</strong></div>
                        <div>{messageToReply.BodyMsg}</div>
                    </div>
                </div>
                <a type="button" className="cursor-pointer text-gray-600 ml-2 duration-200 hover:text-indigo-600 font-medium" onClick={noReply}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
            </div>

            {/*Chat controls area*/}
            <div className="bg-gray-50 flex border-t border-gray-200 p-[9px] justify-between items-center md:px-[20px] md:py-[7px]">
                <div className="flex">

                    {/* Attachments dropdown */}
                    <div className="dropdown dropdown-top flex ">
                        <button className="text-gray-600 duration-200 hover:text-indigo-600 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                        </button>
                        <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-lg w-[150px] p-2">
                            <li>
                                <a onClick={() => document.getElementById('attachImages')?.click()} type="button" className="flex cursor-pointer rounded-lg py-2 px-4 text-gray-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <div>Image</div>
                                </a>
                                <input onChange={(e: any) => props.setFilesToSend(e.target.files)} type="file" id="attachImages" accept=".jpg, .jpge, .png, .tiff" className="hidden" multiple />
                            </li>
                            <li>
                                <a type="button" className="flex cursor-pointer rounded-lg py-2 px-4 text-gray-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                                    <div>Audio</div>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => document.getElementById('attachVideos')?.click()} type="button" className="flex cursor-pointer rounded-lg py-2 px-4 text-gray-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    <div>Video</div>
                                </a>
                                <input onChange={(e: any) => props.setFilesToSend(e.target.files)} type="file" id="attachVideos" accept=".mp4" className="hidden" multiple />
                            </li>
                            <li>
                                <a type="button" className="flex cursor-pointer rounded-lg py-2 px-4 text-gray-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <div>Document</div>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Emojis dropdown */}
                    <div className="dropdown dropdown-top dropdown-hover flex ">
                        <button className="text-gray-600 duration-200 hover:text-indigo-600 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                        <div tabIndex={0} className="dropdown-content menu shadow bg-base-100 w-[350px]">
                            <Picker emoji="point_up_2" onSelect={(emoji: any) => onSelectEmoji(emoji)} color="#4f46e5" emojiTooltip={true} title="Pick your emoji up" set="twitter" showPreview={true} />
                        </div>
                    </div>
                </div>

                {/* Message form */}
                <form className="flex w-available" onSubmit={handleMessageSubmit}>
                    <input autoComplete="off" type="text" id="message" value={message.messageToSend} onInput={(e: any) => onMessageInput(e)} onChange={(e: any) => onInputChange(e.target.value, 'messageToSend', message, setMessage)} className="mr-2 bg-white border border-gray-300 text-gray-900  rounded-full focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Type anything here" />
                    <button type="submit" className="text-indigo-600 border border-indigo-600 hover:bg-indigo-600 duration-200 hover:text-white focus:ring-4 focus:ring-indigo-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                        <svg className="w-5 h-auto dark:indigo-blue-500" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path></svg>
                    </button>
                </form>
            </div>
        </div>
    );
});

export default ChatUIMessagingAreaComponent;