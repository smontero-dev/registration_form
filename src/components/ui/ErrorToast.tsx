import { useState } from "react";

type ErrorToastProps = {
    title?: string;
    message?: string;
}

export default function ErrorToast({ title, message }: ErrorToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    return (
        isVisible && (
            <div className="fixed bottom-4 right-4 z-50 max-w-sm">
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg border border-red-600 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-white flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{title || "Error"}</p>
                            <p className="text-red-100 text-xs mt-1">
                                {message || "An unexpected error occurred."}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-white hover:text-red-200 transition-colors ml-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )
    )
}