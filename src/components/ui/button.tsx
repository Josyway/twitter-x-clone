'use client'

import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

interface ButtonProps {
    classname?: string;
    loading?: boolean; 
    children: string
}

export const Button = ({classname, loading, children }: ButtonProps) => {
    const { pending } = useFormStatus();
    return (
        <button 
        className={`flex items-center gap-2 rounded-3xl bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${classname}`}
        type="submit" disabled={loading}>
            {children}
            {(loading || pending) && <Spinner className="h-3 w-3" />}
        </button>
    )
}