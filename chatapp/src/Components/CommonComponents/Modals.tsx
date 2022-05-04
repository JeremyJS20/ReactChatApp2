import { Picker } from "emoji-mart";
import { FormEventHandler, MouseEventHandler, useEffect, useState } from "react"
import { onInputChange, setDateFormat } from "../ComponentTSCode/CommonComponentTSCode";

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
        .then((result:any) => {
            setMessage('');
            props.setFilesToSend([]);
            setFileElements([]);
            if(result === undefined || result === null) throw result;
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