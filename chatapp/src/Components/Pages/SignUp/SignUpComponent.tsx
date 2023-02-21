import React, { FormEventHandler, MouseEventHandler, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, http } from "../../../Services/ApiServices/HttpClient/HttpClient";
import { socket } from "../../../Services/ApiServices/SocketIOClient/Socket.IOClient";
import { useAuth } from "../../../Services/CustomHooks/AuthProvider";
import { onFormSubmitted, onInputChange } from "../../ComponentTSCode/CommonComponentTSCode";
import { PrivateRoutes } from "../../ComponentTSCode/Routes";
import AuthContext from "../../Context/AuthContext";

import './SignUpComponent.scss';

const SignUpComponent = ({ ...props }): any => {

    const { setAuthUser} = useContext(AuthContext)

    const [signUpData, setSignUpData] = useState({
        name: '',
        lname: '',
        username: '',
        email: '',
        password: ''
    });

    const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

    const navigate: any = useNavigate();

    const inputNameRef = useRef<any>(null);
    const inputNameHelperTextRef = useRef<any>(null);

    const inputLNameRef = useRef<any>(null);
    const inputLNameHelperTextRef = useRef<any>(null);

    const inputUserNameRef = useRef<any>(null);
    const inputUserNameHelperTextRef = useRef<any>(null);

    const inputEmailRef = useRef<any>(null);
    const inputEmailHelperTextRef = useRef<any>(null);

    const inputPassRef = useRef<any>(null);
    const inputPassHelperTextRef = useRef<any>(null);
    const inputPassHelperTextRef2 = useRef<any>(null);
    const inputPassHelperTextRef3 = useRef<any>(null);
    const inputPassHelperTextRef4 = useRef<any>(null);
    const inputPassHelperTextRef5 = useRef<any>(null);

    const inputPass2Ref = useRef<any>(null);
    const inputPass2HelperTextRef = useRef<any>(null);

    const formInvalidToastRef = useRef<any>(null);

    useEffect(() => {
        /*const targetEl = formInvalidToastRef.current;

        // options object
        const options = {
            triggerEl: document.getElementById('triggerElement'),
            transition: 'transition-opacity',
            duration: 1000,
            timing: 'ease-out',

            // callback functions
            onHide: (context:any, targetEl:any) => {
                console.log('element has been dismissed')
                console.log(targetEl)
            }
        };

        const dismiss = new Dismiss(targetEl, options);*/

    }, []);
    
    const validateName: FormEventHandler = (e: any): void => {
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputNameHelperTextRef.current.innerText = 'Provide your name';
        } else {
            e.target.classList.remove('invalid');
            e.target.classList.add('valid');
            inputNameHelperTextRef.current.innerText = '';
        }
    }

    const validateLName: FormEventHandler = (e: any): void => {
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputLNameHelperTextRef.current.innerText = 'Provide your last name';
        } else {
            e.target.classList.remove('invalid');
            e.target.classList.add('valid');
            inputLNameHelperTextRef.current.innerText = '';
        }
    }

    const verifyAndValidateUsername: FormEventHandler = (e: any): void => {
        /**
          * Basicamente verificamos su existencia en la base de datos mediante websocket. Dependiendo de 
          * si existe o no el email, se procede a validar o invalidar el input
          */
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputUserNameHelperTextRef.current.innerText = 'Provide an username';
            return;
        }

        socket.emit('verify username', e.target.value, (res: any) => {
            if (res.userNameExists === false) {
                inputUserNameHelperTextRef.current.innerText = '';
                e.target.classList.remove('invalid')
                e.target.classList.add('valid')
            } else {
                inputUserNameHelperTextRef.current.innerText = 'This username is already in use';
                e.target.classList.remove('valid')
                e.target.classList.add('invalid')
            }
        });
    };

    const verifyAndValidateEmail: FormEventHandler = (e: any): void => {
        /**
         * Basicamente verificamos si el formato del email es correcto y su existencia en la 
         * base de datos mediante websocket. Dependiendo de si existe o no el email, se procede a validar
         * o invalidar el input
         */
        if (e.target.value.length === 0) {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputEmailHelperTextRef.current.innerText = 'Provide your email';
            return;
        }

        socket.emit('verify email', e.target.value, (res: any) => {
            if (res.emailExists === false) {
                inputEmailHelperTextRef.current.innerText = '';
                if (emailFormat.test(e.target.value) === true) {
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                }

                if (emailFormat.test(e.target.value) === false) {
                    inputEmailHelperTextRef.current.innerText = 'Invalid email format';
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                }
            } else {
                inputEmailHelperTextRef.current.innerText = 'This email is already in use';
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            }
        });
    };

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

        if (e.target.value == signUpData.password) {
            e.target.classList.remove('invalid');
            e.target.classList.add('valid');
            inputPass2HelperTextRef.current.innerText = '';
        } else {
            e.target.classList.remove('valid');
            e.target.classList.add('invalid');
            inputPass2HelperTextRef.current.innerText = 'No match in passwords';
        }
    }, [signUpData])

    const handleFormSignUpSubmit = useCallback((e) => {
        e.preventDefault();
        for (let i = 0; i < (e.target.length - 1); i++) {
            const element = e.target[i];
            if (element.classList.contains('valid')) {
                if (i === 5) {
                    http.post('/createNewUser', signUpData)
                        .then((res: any) => {
                            
                            auth.Login({
                                username: signUpData.username,
                                password: signUpData.password
                            })
                                .then((data: any) => {
                                    socket.emit('User authenticated', data.id, data.email);
                                    setAuthUser(data)
                                    return navigate('/chatUI');
                                });
                        })
                        .catch((err: any) => {
                            throw err;
                        });
                }
            } else {
                alert('Form is invalid');
                break;
            }

        }
    }, [signUpData]);

    return (
        <div className="h-screen flex justify-center items-center bg-gray-50 duration-200 dark:bg-indigo-900" style={{ flexDirection: 'column' }}>
            <div className="m-5 text-2xl text-gray-900 dark:text-white">Chat App - Sign Up</div>

            <form className="text-black w-2/3 p-5 border bg-white rounded-lg border-inherit-600 md:w-1/4" onSubmit={handleFormSignUpSubmit}>
                <div className="mb-2">
                    <label htmlFor="name" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your name</label>
                    <input type="text" id="name" ref={inputNameRef} onChange={(e: any) => onInputChange(e.target.value, "name", signUpData, setSignUpData)} onInput={validateName} value={signUpData.name} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Name" />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500" ref={inputNameHelperTextRef}></p>
                </div>
                <div className="mb-2">
                    <label htmlFor="lname" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your last name</label>
                    <input type="text" id="lname" ref={inputLNameRef} onChange={(e: any) => onInputChange(e.target.value, "lname", signUpData, setSignUpData)} onInput={validateLName} value={signUpData.lname} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Last name" />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500" ref={inputLNameHelperTextRef}></p>
                </div>
                <div className="mb-2">
                    <label htmlFor="username" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your username</label>
                    <input type="text" id="username" ref={inputUserNameRef} onChange={(e: any) => onInputChange(e.target.value, "username", signUpData, setSignUpData)} onInput={verifyAndValidateUsername} value={signUpData.username} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Username" />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500" ref={inputUserNameHelperTextRef}></p>
                </div>
                <div className="mb-2">
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your email</label>
                    <input type="email" id="email" ref={inputEmailRef} onChange={(e: any) => onInputChange(e.target.value, "email", signUpData, setSignUpData)} onInput={verifyAndValidateEmail} value={signUpData.email} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Email" />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500" ref={inputEmailHelperTextRef}></p>
                </div>
                <div className="mb-2">
                    <label htmlFor="password" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your password</label>
                    <input type="password" id="password" ref={inputPassRef} onChange={(e: any) => onInputChange(e.target.value, "password", signUpData, setSignUpData)} onInput={validatePass} value={signUpData.password} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Password" />
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500" >
                        Password must contain: <span ref={inputPassHelperTextRef}>Over 8 characters</span>, <span ref={inputPassHelperTextRef2}>Under 16 characters</span>, <span ref={inputPassHelperTextRef3}>One digit</span>, <span ref={inputPassHelperTextRef4}>One upper letter</span> and <span ref={inputPassHelperTextRef5}>One special character(@, $, &, *, %, !, ?)</span>
                    </p>
                </div>
                <div className="mb-6">
                    <label htmlFor="repeat-password" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Confirm password</label>
                    <input type="password" id="repeat-password" ref={inputPass2Ref} onChange={validateConfirmPass} className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:focus:ring-indigo-900 dark:focus:border-indigo-900" placeholder="Confirm password" />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500" ref={inputPass2HelperTextRef}></p>
                </div>
                <button type="submit" id='triggerElement' className=" w-full text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Sign Up</button>
            </form>
            {/*<div id="toast-success" ref={formInvalidToastRef} className=" absolute bottom-5 right-5 flex items-center w-half max-w-xs p-4 mb-4 text-dark bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </div>
                <div className="ml-3 font-medium">Form is invalid</div>
                {/*<button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>*/}
        </div>
    );
};

export default SignUpComponent;