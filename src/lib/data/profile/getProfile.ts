import { getServerUserId } from "@/lib/auth/getServerUserid"
import { db, follows, profiles } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import "server-only"

export async function getCurrentProfileUsername() {
    const userId = await getServerUserId()
    if (!userId) {
        return null
    }
    const [profile] = await db
    .select({username: profiles.username})
    .from(profiles)
    .where(eq(profiles.id, userId))
    return profile?.username ? profile.username :  null

}

export async function getProfileByUserName(username: string) {
    const userId = await getServerUserId();
    const profileQuery = db
        .select({ 
            id: profiles.id, 
            username: profiles.username,
            ...(userId ? {followedByUser: follows.followerId} : {}),
        })
        .from(profiles)
        .where(eq(profiles.username, username));
        if (userId) {
            profileQuery.leftJoin(follows, and(eq(follows.followedId, profiles.id), eq(follows.followerId, userId)),
        );
        }
    const [profile] = await profileQuery;
    const isOwnProfile = profile?.id === userId;
    return {profile: profile ? profile : null, isOwnProfile};
}    
