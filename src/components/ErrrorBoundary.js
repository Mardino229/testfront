"use client";

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => {
    const is404 = error.message.includes('404');
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">
                    {is404 ? 'Page Not Found' : 'An Error Occurred'}
                </h2>
                <p>
                    {is404
                        ? 'Page inexistante. Veuillez retourner à l\'accueil.'
                        : 'Une erreur est survenue. Veuillez réessayer.'}
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default function ErrorBoundary({ children }) {
    return (
        <ReactErrorBoundary FallbackComponent={ErrorFallback}>
            {children}
        </ReactErrorBoundary>
    );
}