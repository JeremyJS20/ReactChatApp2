import axios from "axios";

interface IHttpClient{
    get(url:string): any;
    getWithTimeout(url:string): any;
    post(url:string, data:object): any;
    postWithTimeout(url:string, data:object): any;
    put(url:string, data:object): any;
    delete(url:string, id:number): any;
}

class HttpClient implements IHttpClient{

    private readonly reqInstance:any;

    constructor(){
        if(this.reqInstance != null || this.reqInstance != undefined) return this.reqInstance;

        this.reqInstance = axios.create({
            baseURL: process.env.REACT_APP_API_URL
        });
    }

    public get = (url:string) => {
        return new Promise((resolve, reject) => {
            this.reqInstance.get(url)
            .then((res:any) => resolve(res.data))
            .catch((exec:any) => reject(exec));
        });
    }

    public getWithTimeout = (url:string) => {
        return new Promise((resolve, reject) => {
            this.reqInstance.get(url)
            .then((res:any) => setTimeout(() => resolve(res.data), 3000))
            .catch((exec:any) => setTimeout(() => reject(exec), 3000));
        });
    }
    public post = (url: string, data: object, setProgress?:any) => {
        return new Promise((resolve, reject) =>{
            this.reqInstance.post(url, data, {
                onUploadProgress: (progressEvent: any) => {
                    setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total));
                }
            })
            .then((res:any) => resolve(res.data))
            .catch((exec:any) => reject(exec));
        });
    }

    public postWithTimeout= (url: string, data: object, setProgress?:any) => {
        return new Promise((resolve, reject) =>{
            this.reqInstance.post(url, data, {
                onUploadProgress: (progressEvent: any) => {
                    setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total));
                }
            })
            .then((res:any) => {
                setTimeout(() => resolve(res.data), 3000)
            })
            .catch((exec:any) => setTimeout(() => reject(exec), 3000));
        });
    }

    public put = (url: string, data: object) => {
        return new Promise((resolve, reject) =>{
            this.reqInstance.put(url, data)
            .then((res:any) => resolve(res.data))
            .catch((exec:any) => reject(exec));
        });
    }
    public delete = (url: string) => {
        return new Promise((resolve, reject) =>{
            this.reqInstance.delete(url)
            .then((res:any) => resolve(res.data))
            .catch((exec:any) => reject(exec));
        });
    }

}

interface IAuthClient{
    Login(state:object): any,
    LogOut(): any
}

class AuthClient implements IAuthClient{


    public Login = (state:object) => {
        return new Promise((resolve, reject) => {
            http.postWithTimeout('/verifyAndAuthUser', state)
            .then((data:any) => {
                if(data.length === 0){
                    return resolve(false);
                }
                localStorage.setItem('UserToken', data[0].token);
                return resolve(data[0]);
            });
        });
    }

    public LogOut = () => {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('UserToken');
            return resolve(true);
        });
    }
}

export const http: HttpClient = new HttpClient();
export const auth: AuthClient = new AuthClient();