import { useState } from 'react';
import { http } from '../ApiServices/HttpClient/HttpClient';

export const useAuth:any = () => {
    
    const Login:Function = (state:object) => {
        return new Promise((resolve, reject) => {
            http.post('/verifyAndAuthUser', state)
            .then((data:any) => {
                if(data.length === 0){
                    return resolve(false);
                }
                localStorage.setItem('UserToken', data[0].token);
                return resolve(data[0]);
            });
        });
    }

    const LogOut:Function = () => {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('UserToken');
            return resolve(true);
        });
    }

  return [Login, LogOut];
}