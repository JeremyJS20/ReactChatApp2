import * as React from 'react';
import { http } from '../../../Services/ApiServices/HttpClient/HttpClient';
import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface IResetPasswordProps {
}

const ResetPassword: React.FunctionComponent<IResetPasswordProps> = (props) => {

    const [password, setPassword] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [tokenExpired, setTokenExpired] = useState<boolean>(false);


    const { token } = useParams();
    const navigate = useNavigate();

    const inputPassRef = useRef<any>(null);
    const inputPassHelperTextRef = useRef<any>(null);
    const inputPassHelperTextRef2 = useRef<any>(null);
    const inputPassHelperTextRef3 = useRef<any>(null);
    const inputPassHelperTextRef4 = useRef<any>(null);
    const inputPassHelperTextRef5 = useRef<any>(null);

    const inputPass2Ref = useRef<any>(null);
    const inputPass2HelperTextRef = useRef<any>(null);

    const passFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

    React.useEffect(() => {
        (
            async () => {
                try {
                    const userE = await http.get(`/verifyResetPasswordToken/${token}`);                    
                    if(userE){
                        setUserEmail(userE as string);                        
                    } else{
                        setTokenExpired(true);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        )();
    }, []);

    const onResetPasswordFormSubmitted = useCallback(async (e) => {
        e.preventDefault();
        try {
            for (let i = 0; i < (e.target.length - 1); i++) {
                const element = e.target[i];
                if (element.classList.contains('valid')) {
                    if (i === 1) {
                        await http.post('/resetPassword', {email: userEmail,  password: password });
                        navigate('/signin')
                    }
                } else {
                    alert('Form is invalid');
                    break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [password]);

    const onInputChange = useCallback((e) => {
        setPassword(e.target.value)
    }, [password]);

    const validatePass = useCallback((e) => {
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            /*document.getElementById("passHelperText").innerText = 'Debe proporcionar una contraseña';
            document.getElementById("passHelperText").className = 'helper-text red-text';*/
            return;
        } else {
            /*document.getElementById("passHelperText").innerText = 'Para una mayor seguridad, la contraseña debe cumplir con:';
            document.getElementById("passHelperText").className = 'helper-text';*/
        }
        /**
         * El formato para la clave es:
         * 1. Mayor que 8 caracteres y menor que 15
         * 2. Contiene un digito
         * 3. Contiene una letra mayuscula
         * 4. Contiene un caracter especial
         */

        // 1. Mayor que 8 caracteres y menor que 15
        if (e.target.value.length >= 8) {
            inputPassHelperTextRef.current.className = "text-green-500"
        } else {
            inputPassHelperTextRef.current.className = "text-red-500"
        }

        if (e.target.value.length <= 15) {
            inputPassHelperTextRef2.current.className = "text-green-500"
        } else {
            inputPassHelperTextRef2.current.className = "text-red-500"
        }

        // 2. Contiene un digito        
        if (/\d/.test(e.target.value)) {
            inputPassHelperTextRef3.current.className = "text-green-500"
        } else {
            inputPassHelperTextRef3.current.className = "text-red-500"
        }

        // 3. Contiene una letra mayuscula
        if (/[A-Z]/.test(e.target.value)) {
            inputPassHelperTextRef4.current.className = "text-green-500"
        } else {
            inputPassHelperTextRef4.current.className = "text-red-500"
        }


        // 4. Contiene un caracter especial
        if (/[@$&*%!?]/.test(e.target.value)) {
            inputPassHelperTextRef5.current.className = "text-green-500"
        } else {
            inputPassHelperTextRef5.current.className = "text-red-500"
        }

        //validacion del form
        if (passFormat.test(e.target.value)) {
            e.target.classList.remove('invalid');
            e.target.classList.add('valid');
        } else {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
        }
    }, [])

    const validateConfirmPass = useCallback((e): void => {
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputPass2HelperTextRef.current.innerText = 'Confirm your password';
            return;
        }

        if (e.target.value == password) {
            e.target.classList.remove('invalid');
            e.target.classList.add('valid');
            inputPass2HelperTextRef.current.innerText = '';
        } else {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputPass2HelperTextRef.current.innerText = 'No match in passwords';
        }
    }, [password])

    return (
        <div className="h-screen flex justify-center items-center bg-gray-50 duration-200 dark:bg-indigo-900" style={{ flexDirection: 'column' }}>
            <div className="m-5 text-2xl text-gray-900 dark:text-white">Chat App - Reset Password</div>
            {
          tokenExpired ?
            <div className='text-black w-2/3 p-5 border bg-white rounded-lg border-inherit-600 md:w-1/4'>
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium text-base text-justify">
                    This link has expired. Please try resetting your password again.
                </span>
              </div>
              <button onClick={() => navigate('/forgottenpassword')} className="inline-flex items-center justify-center text-white font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center duration-200 bg-indigo-600 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-900 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600">
                    Go to forgotten password
                </button>
            </div>
            :
            <form className="text-black w-2/3 p-5 border bg-white rounded-lg border-inherit-600 md:w-1/4" onSubmit={onResetPasswordFormSubmitted}>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 font-medium">New password</label>
                    <input type="password" id="password" ref={inputPassRef} onChange={onInputChange} onInput={validatePass} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="New password" required />
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500" >
                        Password must contain: <span ref={inputPassHelperTextRef}>Over 8 characters</span>, <span ref={inputPassHelperTextRef2}>Under 16 characters</span>, <span ref={inputPassHelperTextRef3}>One digit</span>, <span ref={inputPassHelperTextRef4}>One upper letter</span> and <span ref={inputPassHelperTextRef5}>One special character(@, $, &, *, %, !, ?)</span>
                    </p>
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmpassword" className="block mb-2 font-medium">Confirm new password</label>
                    <input type="password" id="confirmpassword" ref={inputPass2Ref} onInput={validateConfirmPass} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Confirm new password" required />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500" ref={inputPass2HelperTextRef}></p>
                </div>
                <button type="submit" className="inline-flex items-center justify-center text-white font-medium rounded-lg text-sm w-full mb-6 px-5 py-2.5 text-center duration-200 bg-indigo-600 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-900 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600">
                    {/* {loginStatus == undefined ? <></> :
              <svg aria-hidden="true" role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
              </svg>
            } */}
                    {/* {loginStatus == undefined ? 'Sign In' : 'Signing In...'} */}
                    Reset password
                </button>
            </form>
        }

        </div>
    );

};

export default ResetPassword;
