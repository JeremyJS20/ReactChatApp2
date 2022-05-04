import { MouseEventHandler, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Services/CustomHooks/AuthProvider";
import { onInputChange } from "../../ComponentTSCode/CommonComponentTSCode";

const SignInComponent = ({ ...props }): JSX.Element => {

    let isLoggedIn: any = useAuth()[0];
    const Login: Function = useAuth()[1];
    const [isSignInDataRight, setIsSignInDataRight] = useState<boolean|null>(true);

    const [signInData, setSignInData] = useState<{
        username: string,
        password: string
    }|null>({
        username: '',
        password: ''
    });
    const [btnType, setBtnType] = useState('password');

    let navigate: any = useNavigate();

    useEffect(() => {
        if (isLoggedIn === true) navigate('/chatUI');
        
        return () => {
            //setSignInData(null);
            //setIsSignInDataRight(null);
            isLoggedIn = null;
            navigate = null;
        }
    }, [isLoggedIn]);

    const onSignInFormSubmitted: any = (e: any, state: object, login: any, navigate: any) => {
        e.preventDefault();
        login(state)
            .then((data: any) => {
                if (!data) return setIsSignInDataRight(false);
                setIsSignInDataRight(true)
                props.socket.emit('User authenticated', data.id, data.email);
                navigate('/chatUI');
            });
    };

    const PasswordBtnTypeSwitcher: MouseEventHandler = (e:any) =>{
        if (btnType === 'text') {
            return setBtnType('password');
        }
        return setBtnType('text')
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-50 duration-200 dark:bg-indigo-900" style={{ flexDirection: 'column' }}>
            
            <div className="m-5 text-2xl dark:text-white">Chat App - Sign In</div>
            <form className="text-black w-2/3 p-5 border bg-white rounded-lg border-inherit-600 md:w-1/4" onSubmit={(e) => onSignInFormSubmitted(e, signInData, Login, navigate)}>
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
                <button type="submit" className="text-white font-medium rounded-lg text-sm w-full mb-6 px-5 py-2.5 text-center duration-200 bg-indigo-600 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-900 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600">Sign In</button>
                <div className="text-center">
                    Don't have an account? <Link to="/signUp" className="duration-200 text-indigo-600  hover:text-indigo-900 dark:text-indigo-900 dark:hover:text-indigo-600">Sign Up</Link>
                </div>
            </form>
        </div>
    );
}

export default SignInComponent;