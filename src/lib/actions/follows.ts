'use server'
import { db, follows } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerUserId } from "../auth/getServerUserid";


export async function followProfile(profileId: string, username: string) {
    const userId = await getServerUserId();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    try {
        const existingFollow = await db
            .select()
            .from(follows)
            .where(and(eq(follows.followerId, userId), eq(follows.followedId, profileId)));

        if (existingFollow.length > 0) { 
            return;
        }

        await db
            .insert(follows)
            .values({ followerId: userId, followedId: profileId })
            .returning();
        revalidatePath(`/profile/${username}`);
    } catch (error) {
        console.error("Error following profile:", error);
        throw new Error("Failed to follow profile"); 
    }
}

export async function unfollowProfile(profileId: string, username: string) {
    const userId = await getServerUserId(); 

    if (!userId) {
        throw new Error("User not authenticated"); 
    }

    try {
        const existingFollow = await db
            .select()
            .from(follows)
            .where(and(eq(follows.followerId, userId), eq(follows.followedId, profileId)));

        if (existingFollow.length === 0) { 
            return;
        }

        await db
            .delete(follows)
            .where(and(eq(follows.followerId, userId), eq(follows.followedId, profileId)));
        revalidatePath(`/profile/${username}`);
    } catch (error) {
        console.error("Error unfollowing profile:", error);
        throw new Error("Failed to unfollow profile"); 
    }
}