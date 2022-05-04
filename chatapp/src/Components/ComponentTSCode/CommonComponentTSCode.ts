import { HttpClient } from "../../Services/ApiServices/HttpClient/HttpClient";

export const onInputChange: Function = (value: string, inputName: string, state: object, setState: any) => {
    setState({ ...state, [inputName]: value });
};

export const onFormSubmitted: Function = (e: any, url: string, state: any, setState: any, navigate?: any) => {
    e.preventDefault();
    for (let key in state) {
        state[key] = '';
    }
    setState({ ...state });
    //if(navigate !== undefined || navigate !== null) navigate("/chatUI")
};

export const containEmojis: Function = (text: string): boolean => {
    return /\p{Emoji}/u.test(text);
};

export const emptyChat: Function = async (from: string, to: string) => {
    const http: HttpClient = new HttpClient();
    const result: boolean | any = await http.delete(`/EmptyChat/${from}-${to}`);
    return result;
};

export const deleteMessage: Function = async (id:string, id2:string) => {
    const http: HttpClient = new HttpClient();
    const result: boolean | any = await http.delete(`/DeleteMessage/${id}-${id2}`);
    console.log(result)
    return result;
};

export const setDateFormat: Function = (date: string, from: string): string => {
    const oldDate: any = new Date(date);
    const todayDate: any = new Date();

    let diffMs = Math.abs(todayDate - oldDate);
    let diffDays = Math.floor(diffMs / 86400000);
    let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    let diffMins = Math.floor((diffMs / 1000) / 60);
    let diffSec = Math.floor((diffMs / 1000));
    let diffMon = Math.floor((diffDays / 31));
    let diffYear = Math.floor((diffMon / 12));

    if (from === "notifications" || from === "contacts") {
        if (diffYear > 0 && diffYear < 3) return (`${diffYear}y ago`);
        if (diffMon > 0 && diffMon < 13) return (`${diffMon} month ago`);
        if (diffDays >= 21 && diffDays < 31) return (`3w ago`);
        if (diffDays >= 14 && diffDays < 21) return (`2w ago`);
        if (diffDays > 6 && diffDays < 14) return (`1w ago`);
        if (diffDays > 0 && diffDays <= 6) return (`${diffDays}d ago`);
        if (diffHrs > 0 && diffHrs < 25) return (`${diffHrs}h ago`);
        if (diffMins > 0 && diffMins < 61) return (`${diffMins}min ago`);
        if (diffSec >= 0 && diffSec < 61) return (`A moment ago`);
        return (todayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    } else {
        if (oldDate.getDate() === todayDate.getDate()) return oldDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (todayDate.getDate() - oldDate.getDate() === 1) return 'Yesterday';
        if (todayDate.getDate() - oldDate.getDate() > 1 && todayDate.getDate() - oldDate.getDate() < 8) return oldDate.toLocaleDateString('en-US', { weekday: 'long' });
        return oldDate.toLocaleDateString('en-US');
    }
}