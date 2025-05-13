import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useAuth } from "../providers/AuthProvider";

interface RequeresAuthProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    as? : "button" | "div" | "span";
}   

export function RequiresAuth({ onClick, children, className, as="button" }: RequeresAuthProps) {
    const { user } = useAuth();
    const router = useRouter();
    const Component = as
    function handleClick(e: React.MouseEvent) {
        if (!user) {
            e.preventDefault();
            e.stopPropagation();
            toast("Você precisa estar logado para fazer isso")
            router.push('/login');
        } else if (onClick) {
                onClick(e);
            }
    }

    return <Component onClick={handleClick} className={className}>
        {children}
    </Component>
}