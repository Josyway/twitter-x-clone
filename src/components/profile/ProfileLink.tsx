'use client'

import { useRouter } from "next/navigation";

interface ProfileLinkProps {
    children: React.ReactNode;
    username: string;
    className?: string;
}

export default function ProfileLink({ children, username, className}: ProfileLinkProps) {
    const router = useRouter();
    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/profile/${username}`);
    }
    return (
        <div role="button" className={className} onClick={handleClick}>{children}</div>
    )

}