import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { HttpClient } from '../ApiServices/HttpClient/HttpClient';
import SocketIOClient from '../ApiServices/SocketIOClient/Socket.IOClient';
const socket:SocketIOClient = new SocketIOClient();
const http:HttpClient = new HttpClient();

export const useAuth:any = () => {
    const [isLoggedIn, setLoggedIn] = useState<any>(null);
    
    let token:any = localStorage.getItem('UserToken');
    let user:any = (token != undefined ? jwtDecode<JwtPayload>(token): null);

    useEffect(() => {
        if(localStorage.getItem('UserToken') === null){
            setLoggedIn(false);
            return;
        }

        http.get(`/verifyUserAuthTokenExpired/${localStorage.getItem('UserToken')}`)
        .then((data:any) => {
            if(data === false){
                localStorage.removeItem('UserToken');
                //socket.getSocketClient().emit('User unauthenticated', user.Id, new Date());
            }
            setLoggedIn(data);
        });
    }, [isLoggedIn]);

    const Login:Function = (state:object) => {
        return new Promise((resolve, reject) => {
            http.post('/verifyAndAuthUser', state)
            .then((data:any) => {
                if(data.length === 0){
                    return resolve(false);
                }
                localStorage.setItem('UserToken', data[0].token);
                setLoggedIn(true);
                return resolve(data[0]);
            });
        });
    }

    const LogOut:Function = () => {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('UserToken');
            setLoggedIn(false);
            return resolve(true);
        });
    }

  return [isLoggedIn, Login, LogOut];
}