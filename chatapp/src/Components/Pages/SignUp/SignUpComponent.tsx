import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onFormSubmitted, onInputChange } from "../../ComponentTSCode/CommonComponentTSCode";

const SignUpComponent = ({ ...props }): any => {

    const [signUpData, setSignUpData] = useState({
        name: '',
        lname: '',
        username: '',
        email: '',
        password: ''
    });

    const navigate:any = useNavigate();

    useEffect(() => {
    }, [signUpData]);

    return (
        <div className="h-screen flex justify-center items-center" style={{ flexDirection: 'column' }}>
            <div className="m-5 text-2xl">Chat App - Sign Up</div>

            <form className="w-2/3 p-5 border rounded-lg border-inherit-600 md:w-1/4" onSubmit={(e:any) => onFormSubmitted(e, signUpData, navigate)}>
            <div className="mb-6">
                    <label htmlFor="name" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your name</label>
                    <input type="text" id="name" onChange={(e:any) => onInputChange(e.target.value, "name", signUpData, setSignUpData)} value={signUpData.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="Name" required/>
                </div>
                <div className="mb-6">
                    <label htmlFor="lname" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your last name</label>
                    <input type="text" id="lname" onChange={(e:any) => onInputChange(e.target.value, "lname", signUpData, setSignUpData)} value={signUpData.lname} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="Last name" required/>
                </div>
                <div className="mb-6">
                    <label htmlFor="username" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your username</label>
                    <input type="text" id="username" onChange={(e:any) => onInputChange(e.target.value, "username", signUpData, setSignUpData)} value={signUpData.username} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="Username" required/>
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your email</label>
                    <input type="email" id="email" onChange={(e:any) => onInputChange(e.target.value, "email", signUpData, setSignUpData)} value={signUpData.email} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="Email" required/>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Your password</label>
                    <input type="password" id="password" onChange={(e:any) => onInputChange(e.target.value, "password", signUpData, setSignUpData)} value={signUpData.password} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="Password" required/>
                </div>
                <div className="mb-6">
                    <label htmlFor="repeat-password" className="block mb-2 font-medium text-gray-900 dark:text-gray-300">Repeat your password</label>
                    <input type="password" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light" placeholder="Repeat password" required/>
                </div>
                <button type="submit" className=" w-full text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Sign Up</button>
            </form>

        </div>
    );
};

export default SignUpComponent;