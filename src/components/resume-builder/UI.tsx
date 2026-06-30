import React from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from '../shared/States';

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
    const baseStyles = "px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-text-strong text-bg hover:bg-signal",
        secondary: "bg-panel-strong text-text-strong border border-hairline hover:bg-panel",
        outline: "bg-transparent text-text border border-hairline hover:bg-panel hover:text-text-strong",
        ghost: "bg-transparent text-text-mute hover:bg-panel hover:text-text-strong",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <Spinner size={16} />
                    Processing...
                </>
            ) : children}
        </button>
    );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const fieldStyles =
    "w-full px-3 py-2.5 border border-hairline rounded-lg bg-panel text-text-strong placeholder:text-text-mute focus:outline-none focus:border-signal focus:bg-panel-strong transition-all text-sm";

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-text-mute mb-1.5">{label}</label>}
            <input className={cn(fieldStyles, className)} {...props} />
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
                {label && <label className="block text-sm font-medium text-text-mute">{label}</label>}
                <div className="flex items-center gap-2">
                    {topRight}
                    {onAIRequest && (
                        <button
                            type="button"
                            onClick={onAIRequest}
                            className="text-xs text-signal font-medium hover:bg-signal/20 flex items-center gap-1 bg-signal/10 px-2 py-0.5 rounded-full transition-colors border border-signal/30"
                        >
                            <span>✨ AI Improve</span>
                        </button>
                    )}
                </div>
            </div>
            <textarea className={cn(fieldStyles, "min-h-[100px]", className)} {...props} />
        </div>
    );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    return (
        <div className={cn("bg-panel border border-hairline rounded-xl p-6", className)}>
            {children}
        </div>
    );
};
