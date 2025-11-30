import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    isLoading,
    ...props
}) => {
    const baseStyles = "px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow",
        secondary: "bg-zinc-700 text-white hover:bg-zinc-600 focus:ring-zinc-500 shadow-sm",
        outline: "bg-transparent text-gray-200 border border-zinc-700 hover:bg-zinc-800 focus:ring-zinc-600 shadow-sm",
        ghost: "bg-transparent text-gray-400 hover:bg-zinc-800 hover:text-white focus:ring-zinc-700",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : children}
        </button>
    );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
            <input
                className={`w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${className}`}
                {...props}
            />
        </div>
    );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    onAIRequest?: () => void;
    topRight?: React.ReactNode;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', onAIRequest, topRight, ...props }) => {
    return (
        <div className="w-full relative">
            <div className="flex justify-between items-center mb-1.5">
                {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
                <div className="flex items-center gap-2">
                    {topRight}
                    {onAIRequest && (
                        <button
                            type="button"
                            onClick={onAIRequest}
                            className="text-xs text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1 bg-blue-900/30 px-2 py-0.5 rounded-full hover:bg-blue-900/50 transition-colors border border-blue-900/50"
                        >
                            <span>✨ AI Improve</span>
                        </button>
                    )}
                </div>
            </div>
            <textarea
                className={`w-full px-3 py-2.5 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[100px] ${className}`}
                {...props}
            />
        </div>
    );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    return (
        <div className={`bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
};
