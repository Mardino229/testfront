"use client";

export default function Custom404() {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Page Not Found</h2>
                <p>Page inexistante. Veuillez retourner à l'accueil.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}