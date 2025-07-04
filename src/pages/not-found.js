import { useState } from 'react';
import ErrorModal from "@/components/ErrorModal";

export default function Error()  {

    return (
        <>
            {(
                <ErrorModal
                    errorCode={404}
                />
            )}
        </>
    );
}

