'use client'

import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

interface HeaderProps {
    children: React.ReactNode;
    hasBackButton?: boolean;
}

export default function Header({children, hasBackButton}: HeaderProps) {
    const router = useRouter()
    return <div className="flex w-full item-center gap-4 border border-gray-200 p-4 text-xl font-bold">
        {hasBackButton && (
            <button onClick={() => router.back()}
            className="text-blue-500"
            >
                <LuArrowLeft />
            </button>
        )}
        {children}
        </div>;
}
