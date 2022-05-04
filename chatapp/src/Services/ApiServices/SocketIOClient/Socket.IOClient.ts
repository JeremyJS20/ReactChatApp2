import { io } from "socket.io-client";

export default class SocketIOClient{

    private readonly socketClient:any;
    private readonly url:any = process.env.REACT_APP_SOCKETIO_URL;

    constructor(){
        if(this.socketClient != null || this.socketClient != undefined) return this.socketClient;

        this.socketClient = io(this.url, { transports: ["websocket"] });
        return this.socketClient;
    }

    public getSocketClient():any {
        return this.socketClient;
    }
}