

import { LuUser } from "react-icons/lu";
import ProfileLink from "../profile/ProfileLink";

interface AvatarProps {
    profileId?: string;
    username? : string;
    size?: number;
    link?: boolean;
}

export default function Avatar({ profileId, username, size = 48, link = true }: AvatarProps ) {
    if (!profileId || !username) {
        return (<div style={{ width: size}}
        className="flex aspect-square rounded-full justify-center bg-gray-200 items-center"
        >
            <LuUser className="h-6 w-6 text-gray-400"/>
        </div>)
    }
    const avatarPlaceholder = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profileId}`
    if (link) {
        return (
            <ProfileLink username={username}>
                <img 
                    src={avatarPlaceholder} 
                    width={size}
                    height={size}
                    alt={username ?? profileId}
                    className="rounded-full mr-4"
                />
            </ProfileLink>
        );
    }
    return <img 
    src={avatarPlaceholder} 
    width={size}
    height={size}
    alt={username ?? profileId}
    className="rounded-full mr-4"
    />
}