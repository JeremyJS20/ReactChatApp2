import axios from "axios";

interface IHttpClient{
    get(url:string): any;
    post(url:string, data:object): any;
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

export const http: HttpClient = new HttpClient();