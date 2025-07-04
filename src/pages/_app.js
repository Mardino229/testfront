'use client';

import "../styles/globals.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {useState} from "react";
import ErrorModal from "@/components/ErrorModal";
import ErrorBoundary from "@/components/ErrrorBoundary";



export default function RootLayout({ Component }) {
    const [queryClient] = React.useState(() => new QueryClient());
    const [errorCode, setErrorCode] = useState("");
    const [text, setText] = useState("");

    const closeModal = () => setErrorCode(null);
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                {errorCode && <ErrorModal errorCode={errorCode} text={text} onClose={closeModal}/>}
                <Component setErrorCode={setErrorCode} setText={setText} />
            </QueryClientProvider>
        </ErrorBoundary>
    );
}


