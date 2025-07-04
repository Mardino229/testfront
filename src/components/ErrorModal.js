// src/components/ErrorModal.js
import React from 'react';
import { useRouter } from 'next/router';

export default function ErrorModal({ errorCode, onClose, text }) {
    const router = useRouter();

    const errorMessages = {
        404: {
            title: "Erreur",
            message: text,
            buttonText: "Retour à l'accueil",
            action: () => router.push('/'),
        },
        default: {
            title: "Erreur inconnue",
            message: "Une erreur est survenue. Veuillez réessayer.",
            buttonText: "Fermer",
            action: onClose,
        },
    };

    const { title, message, buttonText, action } = errorMessages[errorCode] || errorMessages.default;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <button
                    onClick={action}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
