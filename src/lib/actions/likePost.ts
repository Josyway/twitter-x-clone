'use server'
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db, likes } from "@/lib/db";
import { getServerUserId } from "../auth/getServerUserid";

export async function likePost(postId: string, path: string) {
    const userId = await getServerUserId();

    if (userId) {
        const existingLike = await db
            .select()
            .from(likes)
            .where(and(eq(likes.profileId, userId), eq(likes.postId, postId)));
        if (existingLike.length) {
            return;
        }
        await db.insert(likes).values({ profileId: userId, postId });
    } 
    revalidatePath(path);
}

export async function unlikePost(postId: string, path: string) {
    const userId = await getServerUserId();

    if (userId) {
        const existingLike = await db
            .select()
            .from(likes)
            .where(and(eq(likes.profileId, userId), eq(likes.postId, postId)));

        if (!existingLike.length) {
            return;
        }

        await db
            .delete(likes)
            .where(and(eq(likes.profileId, userId), eq(likes.postId, postId)));
        }
        revalidatePath(path);
}
