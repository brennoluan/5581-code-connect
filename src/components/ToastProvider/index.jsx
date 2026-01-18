'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ToastProvider = ({ children }) => {
    return (
        <>
            {children}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    backgroundColor: '#171D1F',
                    color: '#E1E1E1',
                }}
                progressStyle={{
                    backgroundColor: '#81FE88',
                }}
            />
        </>
    )
}

