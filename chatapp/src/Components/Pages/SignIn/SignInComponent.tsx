import { MouseEventHandler, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../Services/ApiServices/HttpClient/HttpClient";
import { socket } from "../../../Services/ApiServices/SocketIOClient/Socket.IOClient";
import { onInputChange } from "../../ComponentTSCode/CommonComponentTSCode";
import { PrivateRoutes } from "../../ComponentTSCode/Routes";
import AuthContext from "../../Context/AuthContext";

const SignInComponent = ({ ...props }): JSX.Element => {

    const [isSignInDataRight, setIsSignInDataRight] = useState<boolean | null>(true);
    const [loginStatus, setLoginStatus] = useState<undefined | 'loading'>(undefined);

    const { setAuthUser } = useContext(AuthContext)

    const [signInData, setSignInData] = useState<{
        username: string,
        password: string
    } | null>({
        username: '',
        password: ''
    });

    const [btnType, setBtnType] = useState('password');

    let navigate: any = useNavigate();

    const onSignInFormSubmitted: any = (e: any, state: object, login: any, navigate: any) => {
        e.preventDefault();
        setLoginStatus('loading');
        setIsSignInDataRight(true);
        login(state)
            .then((data: any) => {
                setLoginStatus(undefined)
                if (!data) {
                    setIsSignInDataRight(false);
                    return;
                };

                setIsSignInDataRight(true)
                setAuthUser(data);
                socket.emit('User authenticated', data.id, data.email);
                navigate(PrivateRoutes.CHATUI);
            });
    };

    const PasswordBtnTypeSwitcher: MouseEventHandler = (e: any) => {
        if (btnType === 'text') {
            return setBtnType('password');
        }
        return setBtnType('text')
    };

    const btnSubmitRef = useRef<any>();

    useEffect(() => {
        if(loginStatus == 'loading'){
            (btnSubmitRef.current as HTMLButtonElement).disabled = true
        } else{
            (btnSubmitRef.current as HTMLButtonElement).disabled = false
        }
    }, [loginStatus]);

    return (
        <div className="h-screen flex justify-center items-center bg-gray-50 duration-200 dark:bg-indigo-900" style={{ flexDirection: 'column' }}>

            <div className="m-5 text-2xl text-gray-900 dark:text-white">Chat App - Sign In</div>
            <form className="text-black w-2/3 p-5 border bg-white rounded-lg border-inherit-600 md:w-1/4" onSubmit={(e) => onSignInFormSubmitted(e, signInData, auth.Login, navigate)}>
                <div className={`${isSignInDataRight ? 'hidden' : ''} p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800`} role="alert">
                    Username or password is wrong
                </div>
                <div className="mb-6">
                    <label htmlFor="username" className="block mb-2 font-medium">Your username</label>
                    <input type="text" id="username" onChange={(e: any) => onInputChange(e.target.value, "username", signInData, setSignInData)} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Username" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 font-medium">Your password</label>
                    <div className="flex">
                        <input type={btnType} id="password" onChange={(e: any) => onInputChange(e.target.value, "password", signInData, setSignInData)} className="bg-white border border-gray-300 text-gray-900 rounded-lg rounded-r-none focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-white dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Password" required />
                        <button type="button" onClick={PasswordBtnTypeSwitcher} className="inline-flex items-center px-3 text-sm text-white  font-medium rounded-r-lg border border-r-0  bg-indigo-600 duration-200 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-600 border-indigo-600 dark:bg-indigo-900 dark:hover:bg-indigo-600 dark:text-white dark:border-indigo-900">
                            {
                                btnType === 'password' ?
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                            }
                        </button>
                    </div>
                </div>
                <div className="text-right text-indigo-600 mb-6 dark:text-indigo-900">
                    <Link to="/forgottenPassword" className="duration-200 hover:text-indigo-900 dark:hover:text-indigo-600">Forgotten password?</Link>
                </div>

                <button ref={btnSubmitRef} type="submit" className="inline-flex items-center justify-center text-white font-medium rounded-lg text-sm w-full mb-6 px-5 py-2.5 text-center duration-200 bg-indigo-600 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-900 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600">
                    {loginStatus == undefined ? <></> :
                        <svg aria-hidden="true" role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                        </svg>
                    }
                    {loginStatus == undefined ? 'Sign In' : 'Signing In...'}
                </button>
                <div className="text-center">
                    Not registered? <Link to="/signUp" className="duration-200 text-indigo-600  hover:text-indigo-900 dark:text-indigo-900 dark:hover:text-indigo-600">Sign Up</Link>
                </div>
            </form>
        </div>
    );
}

export default SignInComponent;