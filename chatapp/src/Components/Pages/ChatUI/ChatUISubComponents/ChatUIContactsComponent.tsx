import React, { useEffect, useState } from "react";
import { onInputChange, setDateFormat } from "../../../ComponentTSCode/CommonComponentTSCode";

const ChatUIContactsComponent: any = ({ ...props }) => {

    const [searchContact, setSearchContact] = useState({ contactToSearch: '' });
    const [contacts, setContacts] = useState<any>([]);
    const [refresh, setRefresh] = useState('')

    useEffect(() => {
        const controller = new AbortController();

        if (contacts.length === 0 && props.userid != null) getContacts(props.userid, setContacts);

        return () => {
            controller.abort();
        };
    }, [refresh, contacts, searchContact]);

/*    props.socket.on("Friend connected", (id: string) => {
        if (contacts.length === 0) return;
        contacts.filter((contact: any) => contact.Id === id)[0].ConnData.Status = "Online";
        for (let i = 0; i < document.getElementsByClassName(id).length; i++) {
            const element = document.getElementsByClassName(id)[i];
            element.innerHTML = "Online";
        }
        props.setContacts(contacts)
        //setRefresh('y');
    });

    props.socket.on("Friend disconnected", (id: string, date: Date) => {
        if (contacts.length === 0) return;
        contacts.filter((contact: any) => contact.Id === id)[0].ConnData.Status = "Offline";
        contacts.filter((contact: any) => contact.Id === id)[0].ConnData.LastConn = date;
        for (let i = 0; i < document.getElementsByClassName(id).length; i++) {
            const element = document.getElementsByClassName(id)[i];
            element.innerHTML = `Offline(${setDateFormat(date, 'Contacts')})`;
        }
        props.setContacts(contacts)

        //setRefresh('y2')
    });*/

    const getContacts: any = async (id: string, setState: any) => {
        const contacts = await props.http.get(`/myContacts/${id}`);
        setState(contacts);
        props.setContacts(contacts)
    };

    const showContacts: Function = () => {
        if (contacts.length === 0) {
            return (
                <div className="flex items-center justify-center h-available text-xl">
                    <strong>No contacts in list</strong>
                </div>
            );
        }
        return contacts.map((contact: any) =>
            <a key={contact.Id} onClick={() => props.setSelectedChat(contact)} className="cursor-pointer flex items-center py-2 px-4 w-full duration-200 hover:bg-indigo-600 hover:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <img src="data:image/jpeg;base64,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" className="w-14 mr-2 rounded-full h-auto" alt="photo" />
                <div className="flex w-available" style={{ flexDirection: 'column' }}>
                    <div className="flex justify-between items-end">
                        <div className="text-[17px] w-available"><strong>{contact.FullName}</strong></div>
                    </div>
                    <div className="flex justify-between ">
                        <div className={`${contact.Id} text-sm w-available`}>{contact.ConnData.Status === 'Online' ? contact.ConnData.Status : contact.ConnData.LastConn === undefined ? 'Offline' : `${contact.ConnData.Status}(${setDateFormat(contact.ConnData.LastConn, 'contacts')})`}</div>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <button className="duration-200 font-medium rounded-full text-sm text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-lg w-[200px] p-2">
                        <li>
                            <a type="button" className="flex cursor-pointer rounded-lg py-2 px-4 text-gray-700 hover:bg-red-600 hover:text-white dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path></svg>
                                <div>Delete contact</div>
                            </a>
                        </li>
                    </ul>
                </div>
            </a>
        );
    };

    return (
        <div className="w-1/4 text-black bg-gray-50 dark:bg-gray-700 dark:text-white hidden md:flex" style={{ flexDirection: 'column' }}>
            {/*Search chat area */}
            <div className="flex justify-between py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <div className="relative w-available">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="text" id="email-adress-icon" value={searchContact.contactToSearch} onChange={(e) => onInputChange(e.target.value, "contactToSearch", searchContact, setSearchContact)} className="bg-white border border-gray-300 text-black rounded-full focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Search contact" />
                </div>
                <button type="button" data-tooltip-target="tooltipAddFrienButton" data-tooltip-placement="bottom" className="text-indigo-700 border border-indigo-600 ml-2 hover:bg-indigo-600 hover:text-white focus:ring-4 focus:ring-indigo-300 font-medium duration-200 rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-white dark:focus:ring-indigo-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                </button>
                <div id="tooltipAddFrienButton" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    Add contact
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
            {/*Contact list area */}
            <div id='contactsContainer' className="flex overflow-y-auto h-available" style={{ flexDirection: 'column' }}>
                {showContacts()}
            </div>
        </div>
    );
};

export default ChatUIContactsComponent;