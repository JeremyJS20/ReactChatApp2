import { Picker } from "emoji-mart";
import { FormEventHandler, MouseEventHandler, useCallback, useContext, useEffect, useRef, useState } from "react"
import { onInputChange, setDateFormat } from "../ComponentTSCode/CommonComponentTSCode";
import * as React from 'react';
import { Modal } from "flowbite-react/lib/esm/components/Modal";
import { socket } from "../../Services/ApiServices/SocketIOClient/Socket.IOClient";
import { http } from "../../Services/ApiServices/HttpClient/HttpClient";
import AuthContext from "../Context/AuthContext";
import { Button, Toast } from "flowbite-react";
import SuccessToast from "./Toast";

export const PopupModal: Function = ({ ...props }): any => {

    return (
        <div>
            <input type="checkbox" id="my-modal" className="modal-toggle hidden" />
            <div className="modal">
                <div className="modal-box">
                    <div className="py-4 text-center text-black text-lg">
                        <svg className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {props.message}
                    </div>
                    <div className="modal-action justify-center">
                        <label htmlFor="my-modal" className="btn border border-indigo-600 bg-indigo-600 text-sm hover:bg-indigo-800" onClick={(e: any): MouseEventHandler => props.action()} >Yes, i'm sure</label>
                        <label htmlFor="my-modal" className="btn border border-red-600 bg-red-600 hover:bg-red-800">No, cancel</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ForwardModal: Function = ({ ...props }): JSX.Element => {

    useEffect(() => { }, [props.contacts])

    const ForwardMessage: Function = async (contact: any) => {
        const result = await props.http.post('/ForwardMessage', {
            From: props.userid,
            To: contact.Id,
            IdForwardMessage: props.messageToForward._id,
        });
        props.setSelectedChat(contact);
    }

    return (
        <div>
            <input type="checkbox" id="forwardModal" className="modal-toggle hidden" />
            <div className="modal">
                <div className="modal-box bg-white w-full md:w-1/4" style={{ padding: '0' }}>
                    <div className="py-4 text-black text-lg flex" style={{ flexDirection: 'column', padding: '0' }}>
                        <div className="py-2 px-4">
                            <strong>Forward message to:</strong>
                        </div>
                        <div className="relative px-2" style={{ marginBottom: '0.5rem' }}>
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" style={{ borderWidth: '0px' }} className="bg-white text-black rounded-full block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Search chat" />
                        </div>
                        <div className="flex overflow-y-auto bg-gray-50 border" style={{ flexDirection: 'column', maxHeight: '300px' }}>
                            {
                                props.contacts.map((contact: any) =>
                                    <label htmlFor="forwardModal" key={contact.Id} onClick={() => ForwardMessage(contact)} className="cursor-pointer flex items-center py-2 px-4 w-full duration-200 hover:bg-indigo-600 hover:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                        <img src="data:image/jpeg;base64,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" className="w-14 mr-2 rounded-full h-auto" alt="photo" />
                                        <div className="flex w-available" style={{ flexDirection: 'column' }}>
                                            <div className="flex justify-between items-end">
                                                <div className="text-[17px] w-available"><strong>{contact.FullName}</strong></div>
                                            </div>
                                            <div className="flex justify-between ">
                                                <div className={`${contact.Id} text-sm w-available`}>{contact.ConnData.Status === 'Online' ? contact.ConnData.Status : contact.ConnData.LastConn === undefined ? 'Offline' : `${contact.ConnData.Status}(${setDateFormat(contact.ConnData.LastConn, 'contacts')})`}</div>
                                            </div>
                                        </div>
                                    </label>
                                )
                            }
                        </div>
                    </div>
                    <div className="modal-action p-2" style={{ margin: '0' }}>
                        {/* <label htmlFor="forwardModal" className="btn border border-indigo-600 bg-indigo-600 text-sm hover:bg-indigo-800" onClick={(e: any): MouseEventHandler => props.action()} >Yes, i'm sure</label> */}
                        <label htmlFor="forwardModal" className="btn border border-red-600 bg-red-600 hover:bg-red-800">Cancel</label>
                    </div>
                </div>
            </div>
        </div>
    );
    ;
}

export const FilesModal: Function = ({ ...props }): JSX.Element => {

    const [message, setMessage] = useState<string>('');
    const [fileElements, setFileElements] = useState<any>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    useEffect(() => {
        console.log(uploadProgress)
        if (fileElements.length === 0) onSelectedFiles();
    }, [props.filesToSend, fileElements, uploadProgress])

    const onSelectedFiles = (): void => {
        const fileReaders: any = [];
        for (let i = 0; i < props.filesToSend.length; i++) {
            const element = props.filesToSend[i];

            const fileReader = new FileReader();
            fileReader.readAsDataURL(element);
            fileReader.onloadend = (e) => {
                fileReaders.push({
                    fileId: i,
                    fileName: element.name,
                    fileSize: element.size,
                    fileMimetype: element.type,
                    fileDataUrl: fileReader.result,
                });

                if (i === props.filesToSend.length - 1) setFileElements(fileReaders);
            };
        }
    }

    const showFilesPreview: Function = (): JSX.Element => {
        if (fileElements.length === 0) return <div></div>;

        if (fileElements.length === 1) {
            if (fileElements[0].fileDataUrl.toString().includes("image")) {
                return (
                    <div className="flex justify-center items-center">
                        <img
                            src={fileElements[0].fileDataUrl}
                            className="w-[150px] h-auto"
                        />
                    </div>
                );
            }

            if (fileElements[0].fileDataUrl.toString().includes("video")) {
                return (
                    <div className="flex justify-center items-center">
                        <video controls style={{ width: '400px' }} className="h-auto">
                            <source
                                src={fileElements[0].fileDataUrl}
                                type={fileElements[0].fileMimetype}
                            />
                            <p>Your browser doesn't support HTML5 video.</p>
                        </video>
                    </div>
                );
            }
        }

        return showMultipleFilesPreview();
    };

    const showMultipleFilesPreview: Function = (): JSX.Element => {

        return fileElements.map((file: any) =>
            file.fileDataUrl.includes('image') ?
                <div className="flex items-center px-2" key={file.fileId}>
                    <img src={file.fileDataUrl} className="w-[150px] mr-2 h-auto" />
                    <div className="flex w-available text-base" style={{ flexDirection: 'column' }}>
                        <div className="text-indigo-600"><strong>{file.fileName}</strong></div>
                        <div>
                            {Math.floor(file.fileSize * 0.000001) === 0
                                ? (file.fileSize / 1000).toString().substr(0, 5) + " KB"
                                : (file.fileSize * 0.000001).toString().substr(0, 3) + " MB"}
                        </div>
                    </div>
                </div>
                :
                file.fileDataUrl.includes('video') ?
                    <div className="flex items-center px-2" key={file.fileId}>
                        <video controls className="w-[150px] mr-2 h-auto">
                            <source
                                src={file.fileDataUrl}
                                type={file.fileMimetype}
                            />
                            <p>Your browser doesn't support HTML5 video.</p>
                        </video>
                        <div className="flex w-available text-base" style={{ flexDirection: 'column' }}>
                            <div className="text-indigo-600"><strong>{file.fileName}</strong></div>
                            <div>
                                {Math.floor(file.fileSize * 0.000001) === 0
                                    ? (file.fileSize / 1000).toString().substr(0, 5) + " KB"
                                    : (file.fileSize * 0.000001).toString().substr(0, 3) + " MB"}
                            </div>
                        </div>
                    </div>
                    :
                    ''
        );
    };

    const onFileFormSubmit: FormEventHandler = async (e: any) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("From", props.userid);
        formData.append("To", props.selectedChat.Id);
        formData.append("Body", message);
        formData.append("MsgType", props.filesToSend.length < 2 ? props.filesToSend[0].type.split('/')[0] + 'FileUplodaed' : props.filesToSend[0].type.split('/')[0] + 'FilesUplodaed');

        for (let i = 0; i < props.filesToSend.length; i++) {
            const fts = props.filesToSend[i];
            formData.append("files", fts)
        }

        props.http.post("/SendMessageWithFile", formData, setUploadProgress)
            .then((result: any) => {
                setMessage('');
                props.setFilesToSend([]);
                setFileElements([]);
                if (result === undefined || result === null) throw result;
            });
    }

    const onInputChange: Function = (e: any): void => {
        setMessage(e.target.value);
    }

    const onSelectEmoji: Function = (emoji: any): void => {
        setMessage(`${message} ${emoji.native}`);
    }

    return (
        <div>
            <input type="checkbox" id="filesModal" className="modal-open hidden" />
            <div className={`modal ${props.filesToSend.length > 0 ? 'modal-open' : ''}`}>
                <div className="modal-box bg-white w-full md:w-[400px]" style={{ padding: '0' }}>
                    <div className="py-4 text-black text-lg flex" style={{ flexDirection: 'column', padding: '0' }}>
                        <div className="py-2 px-4">
                            <strong>
                                {
                                    fileElements.length === 0 ? '' :
                                        fileElements[0].fileDataUrl.includes('image') ?
                                            `${fileElements.length} ${fileElements.length === 0 ? 'image' : 'images'} selected:`
                                            :
                                            fileElements[0].fileDataUrl.includes('video') ?
                                                `${fileElements.length} ${fileElements.length === 0 ? 'video' : 'videos'} selected:`
                                                :
                                                fileElements[0].fileDataUrl.includes('audio') ?
                                                    `${fileElements.length} ${fileElements.length === 0 ? 'audio' : 'audios'} selected:`
                                                    :
                                                    fileElements[0].fileDataUrl.includes('application') ?
                                                        `${fileElements.length} ${fileElements.length === 0 ? 'document' : 'documents'} selected:`
                                                        :
                                                        ''
                                }
                            </strong>
                        </div>
                        <div className="flex overflow-y-auto bg-gray-50 border" style={{ flexDirection: 'column', maxHeight: '350px' }}>
                            {showFilesPreview()}
                        </div>
                    </div>
                    <div className="flex p-2">
                        <form className="flex w-available" name='formFiles' onSubmit={onFileFormSubmit} encType="multipart/form-data">
                            <input autoComplete="off" type="text" id="message" value={message} onInput={(e: any) => onInputChange(e)} className="bg-white border border-gray-300 text-gray-900  rounded-full focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Type anything here" />
                            <button type="submit" id='btnFileForm' className="hidden"></button>
                        </form>
                        <div className="dropdown  dropdown-top dropdown-end dropdown-hover flex ">
                            <button className="text-gray-600 duration-200 hover:text-indigo-600 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </button>
                            <div tabIndex={0} className="dropdown-content menu shadow bg-base-100 ">
                                <Picker emoji="point_up_2" onSelect={(emoji: any) => onSelectEmoji(emoji)} color="#4f46e5" emojiTooltip={true} title="Pick your emoji up" set="twitter" showPreview={true} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-action p-2" style={{ margin: '0' }}>
                        <label htmlFor="filesModal" onClick={() => {
                            props.setFilesToSend([])
                            setFileElements([])
                        }} className="btn border border-red-600 bg-red-600 hover:bg-red-800">Cancel</label>
                        <label onClick={() => document.getElementById('btnFileForm')?.click()} className="btn border border-indigo-600 bg-indigo-600 text-sm hover:bg-indigo-800" >Send</label>
                    </div>
                </div>
            </div>
        </div>
    );
    ;
}

export const ContactsModalComponent = React.forwardRef(({ ...props }: { addContactModalRef: React.MutableRefObject<any>, chatUIMessagingAreaRef: React.MutableRefObject<any>, chatUIRecentChatsRef: any }, ref) => {

    const [contacts, setContacts] = useState<any[]>();
    const [show, setShow] = useState<boolean>(false);
    const [selectedChat, setSelectedChat] = useState<any>(undefined);

    React.useImperativeHandle(ref, () => {
        return {
            contacts: contacts,
            setContacts: setContacts,
            show: show,
            setShow: setShow,
            selectedChat: selectedChat,
            setSelectedChat: setSelectedChat
        }
    });

    socket.on("Friend connected", (id: string) => {
        if (contacts == undefined || contacts.length === 0) return;
        contacts.filter((contact: any) => contact.Id === id)[0].ConnData.Status = "Online";
        for (let i = 0; i < document.getElementsByClassName(id).length; i++) {
            const element = document.getElementsByClassName(id)[i];
            element.innerHTML = "Online";
        }
        setContacts(contacts)
        //setRefresh('y');
    });

    socket.on("Friend disconnected", (id: string, date: Date) => {
        if (contacts == undefined || contacts.length === 0) return;
        contacts.filter((contact: any) => contact.Id === id)[0].ConnData.Status = "Offline";
        contacts.filter((contact: any) => contact.Id === id)[0].ConnData.LastConn = date;
        for (let i = 0; i < document.getElementsByClassName(id).length; i++) {
            const element = document.getElementsByClassName(id)[i];
            element.innerHTML = `Offline(${setDateFormat(date, 'Contacts')})`;
        }
        setContacts(contacts)

        //setRefresh('y2')
    });

    const showContacts = () => {
        if (contacts == undefined) {
            const count = [1, 2, 3, 4, 5];
            return (
                <div role="status" className="animate-pulse px-2 flex flex-col">
                    {count.map((c) => (
                        <div key={c} className="flex items-center">
                            <svg className="w-20 h-20 text-gray-200 dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
                            <div style={{ width: '82%' }} className="">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                                <div className="w-20 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                        </div>
                    ))}

                    <span className="sr-only">Loading...</span>
                </div>
            )
        }

        if (contacts.length == 0) {
            return (
                <div className="p-4 flex flex-col text-black justify-center items-center">No contacts found</div>
            );
        }

        return (
            <div className="flex flex-col">
                {contacts.map((contact) => (
                    <a key={contact.UserName} onClick={() => {
                        setSelectedChat(contact);
                        props.chatUIMessagingAreaRef.current.setSelectedChat(contact);
                        props.chatUIRecentChatsRef.current.setSelectedChat(contact);
                        setShow(false);
                    }} className="flex p-4 flex-row justify-between items-center cursor-pointer hover:bg-gray-100">
                        <img src={contact.ProfilePhoto} className="rounded-full w-14 h-14" />
                        <div style={{ width: '82%' }} className="">
                            <div className="text-black">{contact.FullName}</div>
                            <div className={`${contact.Id}modalcontact text-sm  ${contact.ConnData.Status === 'Online' ? 'text-indigo-600' : 'text-gray-500'}`}>{contact.ConnData.Status === 'Online' ? contact.ConnData.Status : contact.ConnData.LastConn === undefined ? 'Offline' : `${contact.ConnData.Status}(${setDateFormat(contact.ConnData.LastConn, 'contacts')})`}</div>
                        </div>
                    </a>
                ))}
            </div>
        )
    }


    return (
        <Modal
            show={show}
            size="md"
            onClose={() => setShow(false)}
        >
            <Modal.Header>
                Contacts
            </Modal.Header>
            <Modal.Body className="!p-0 overflow-y-auto	max-h-[55vh] modalcontact">
                <div className="py-2">
                    {showContacts()}
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-between">
                <Button onClick={() => {
                    props.addContactModalRef.current.setShow(true);
                    setShow(false);
                }} className="bg-indigo-700 hover:!bg-indigo-800 focus:ring-0">
                    Add contact
                </Button>
                <Button onClick={() => setShow(false)} className="!bg-white border border-gray-400 text-gray-700 hover:bg-gray-400 focus:ring-0">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
})

export const AddContactModalComponent = React.forwardRef(({ ...props }: { contactsModalRef: React.MutableRefObject<any> }, ref) => {

    const { authUser, setAuthUser } = useContext(AuthContext);

    const [contactData, setContactData] = useState<any>({ Name: '', LName: '', Username: '' });
    const [idContact, setIdContact] = useState<any>()
    const inputNameRef = useRef<any>(null);
    const inputLNameRef = useRef<any>(null);
    const inputUserNameRef = useRef<any>(null);
    const inputUserNameHelperTextRef = useRef<any>(null);
    const btnSubmitRef = useRef<any>(null);
    const newContactFormRef = useRef<any>(null);
    const toastSuccessRef = useRef<any>(null);

    const [show, setShow] = useState<boolean>(false);

    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            setShow: setShow
        }
    });

    const handleFormSignUpSubmit = useCallback(async (e) => {
        e.preventDefault();

        try {
            for (let i = 0; i < (e.target.length - 1); i++) {
                const element = e.target[i];
                if (element.classList.contains('valid')) {
                    if (i === 2) {
                        const result = await http.post('/addContact', { ...contactData, IDContact: idContact, IDUser: authUser.Id });
                        const temp = (props.contactsModalRef.current.contacts as Array<any>).slice();
                        temp.push(result);
                        props.contactsModalRef.current.setContacts(temp);

                        toastSuccessRef.current.setToastStatus('show');
                        setTimeout(() => toastSuccessRef.current.setToastStatus('hidden'), 3000);

                        onModalClose();
                    }
                } else {
                    element.classList.add("invalid");
                }
            }
        } catch (error) {
            throw error
        }
    }, [contactData, idContact, authUser]);

    const validateName = useCallback((e: any): void => {
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
        } else {
            e.target.classList.remove('invalid');
            e.target.classList.add('valid');
        }
    }, []);

    const verifyAndValidateUsername = (e: any): void => {
        /**
          * Basicamente verificamos su existencia en la base de datos mediante websocket. Dependiendo de 
          * si existe o no el email, se procede a validar o invalidar el input
          */
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputUserNameHelperTextRef.current.innerText = 'Provide an username';
            return;
        }

        socket.emit('find user', e.target.value, authUser.Id, (res: any) => {

            if (res.IDUser != undefined) {
                inputUserNameHelperTextRef.current.classList.remove("text-red-500")
                inputUserNameHelperTextRef.current.classList.add("text-indigo-600")
                inputUserNameHelperTextRef.current.innerText = 'User was found';
                e.target.classList.remove('invalid')
                e.target.classList.add('valid')
                setIdContact(res.IDUser)
            } else {
                inputUserNameHelperTextRef.current.classList.remove("text-indigo-600")
                inputUserNameHelperTextRef.current.classList.add("text-red-500")

                if (res.errCode == 6) {
                    inputUserNameHelperTextRef.current.innerText = res.errMsg;
                } else {
                    inputUserNameHelperTextRef.current.innerText = 'This user does not exists';
                }

                e.target.classList.remove('valid')
                e.target.classList.add('invalid')
            }
        });
    }

    const onModalClose = useCallback(() => {
        (newContactFormRef.current as HTMLFormElement).querySelectorAll('input').forEach((input) => input.classList.remove('invalid', 'valid'));
        inputUserNameHelperTextRef.current.innerText = '';
        setContactData({ Name: '', LName: '', Username: '' });
        setIdContact(undefined);
        setShow(false);
    }, [contactData, idContact, show]);

    return (
        <>
            <Modal
                show={show}
                size="md"
                onClose={onModalClose}
            >
                <Modal.Header>
                    New contact
                </Modal.Header>
                <Modal.Body className="p-0">
                    <form className="px-4 py-2" ref={newContactFormRef} onSubmit={handleFormSignUpSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">First name</label>
                            <input type="text" id="name" ref={inputNameRef} onChange={(e: any) => onInputChange(e.target.value, "Name", contactData, setContactData)} onInput={validateName} value={contactData.Name} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Name" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lname" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Last name</label>
                            <input type="text" id="lname" ref={inputLNameRef} onChange={(e: any) => onInputChange(e.target.value, "LName", contactData, setContactData)} onInput={validateName} value={contactData.LName} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Last name" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Username</label>
                            <input type="text" id="username" ref={inputUserNameRef} onChange={(e: any) => onInputChange(e.target.value, "Username", contactData, setContactData)} onInput={verifyAndValidateUsername} value={contactData.Username} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Username" />
                            <p className="mt-1 text-sm text-red-500" ref={inputUserNameHelperTextRef}></p>
                        </div>
                        <button type="submit" className="hidden" ref={btnSubmitRef} />
                    </form>
                </Modal.Body>
                <Modal.Footer className="justify-end">
                    <Button onClick={onModalClose} className="!bg-white border border-gray-400 text-gray-700 hover:bg-gray-400 focus:ring-0">
                        Cancel
                    </Button>
                    <Button onClick={() => btnSubmitRef.current.click()} className="bg-indigo-700 hover:!bg-indigo-800 focus:ring-0">
                        Add contact
                    </Button>
                </Modal.Footer>
            </Modal>
            <div ref={toastSuccessRef} className={'hidden'}>
                <div className="bg-white fixed z-10 left-[50%] bottom-[30px] rounded-xl p-4 flex flex-row items-center shadow-xl" >
                    <svg className="w-8 h-8 bg-indigo-300 text-indigo-700 p-1 rounded-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <div className="text-sm ml-3 text-gray-500">
                        Contact was added to contact list
                    </div>
                </div>
            </div>
            <SuccessToast ref={toastSuccessRef} msg="Contact was added to contact list" />
        </>
    );
});

/**
 *  <div id="" tabIndex={-1} className="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div className="relative w-full h-full max-w-md md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="contactsModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                        <button data-modal-toggle="contactsModal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Yes, I'm sure
                        </button>
                        <button data-modal-toggle="contactsModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                    </div>
                </div>
            </div>
        </div>
 */