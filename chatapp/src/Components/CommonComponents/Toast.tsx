import * as React from 'react';
import { forwardRef, useState } from 'react';

interface IGenericToastProps {
    msg: string
}

const SuccessToast= forwardRef(({...props}:IGenericToastProps, ref) => {

    const [toastStatus, setToastStatus] = useState<'show'|'hidden'>('hidden');

    React.useImperativeHandle(ref, () => {
        return {
            toastStatus: toastStatus,
            setToastStatus: setToastStatus
        }
    });

    return (
        <div className={toastStatus}>
            <div className="bg-white fixed z-10 left-[50%] bottom-[30px] rounded-xl p-4 flex flex-row items-center shadow-xl" >
                <svg className="w-8 h-8 bg-indigo-300 text-indigo-700 p-1 rounded-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <div className="text-sm ml-3 text-gray-500">
                    {props.msg}
                </div>
            </div>
        </div>
    );
})

export default SuccessToast;
