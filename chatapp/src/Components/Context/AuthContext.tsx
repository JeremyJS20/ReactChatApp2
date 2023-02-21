import * as React from 'react';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { http } from '../../Services/ApiServices/HttpClient/HttpClient';

interface IAppProps extends PropsWithChildren<any> {
}

const AuthContext = createContext<any>(undefined)

const AuthContextProvider: React.FunctionComponent<IAppProps> = ({ children }: any) => {
    const [authUser, setAuthUser] = useState<any>(undefined);

    useEffect(() => {
        (
            async () => {
                try {                    
                    if (localStorage.getItem('UserToken') === null) {
                        return setAuthUser(undefined);
                    }

                    const result = await http.get(`/verifyUserAuthTokenExpired/${localStorage.getItem('UserToken')}`);                    
                    
                    if (result === undefined || result == '') {
                        localStorage.removeItem('UserToken');
                        //socket.getSocketClient().emit('User unauthenticated', user.Id, new Date());
                    } else{
                        setAuthUser(result);
                    }
                } catch (error) {
                    throw error
                }
            }
        )();
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext as default, AuthContextProvider };
