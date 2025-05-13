'use client'

import { followProfile, unfollowProfile } from "@/lib/actions/follows";
import { RequiresAuth } from "@/lib/auth/RequiresAuth";
import { useOptimistic, useTransition } from "react";

interface FollowButtonProps {
    followedByUser: boolean;
    profileId: string;
    username: string
}

export default function FollowButton( { followedByUser, profileId, username }: FollowButtonProps ) {
    const [, startTransition] = useTransition();
    const [optimistFollowedByUser, setOptmisticFollowedByUser] = useOptimistic(followedByUser);

async function handleFollowOrUnFollow() {
    startTransition(async() => {
        if (optimistFollowedByUser) {
            setOptmisticFollowedByUser(false)
            await unfollowProfile(profileId, username)
        } else {
            setOptmisticFollowedByUser(true)
            await followProfile(profileId, username)
        }
    });   
}
    return <RequiresAuth
                onClick={handleFollowOrUnFollow}
                className={`flex items-center rounded-3xl px-4 py-2 text-base ${
                    optimistFollowedByUser ? 'bg-blue-500 hover:bg-gray-400' : 'bg-gray-500 hover:bg-blue-400'
                }`}
            >
                <span>{optimistFollowedByUser ? "Deixar de seguir" : "Seguir"}</span>
            </RequiresAuth>
}
