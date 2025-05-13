import { getServerUserId } from "@/lib/auth/getServerUserid";
import { db, follows, likes, posts, profiles } from "@/lib/db";
import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import "server-only";

export async function getFeed () {
    const userId = await getServerUserId();
    if (!userId) {
        return [];
    }
    const userLikes = alias(likes, "userLikes" )
    const childPosts = alias(posts, "childPosts"); 
    return db
    .select({
    postId: posts.id,
    content: posts.content,
    createdAt: posts.createdAt,
    profileId: posts.profileId,
    username: profiles.username,
    parentId: posts.parentId,
    likeCount: sql<number>`CAST(COUNT(DISTINCT${likes.id}) as int)`,
    commentCount: sql<number>`CAST(COUNT(DISTINCT${childPosts.id}) as int)`,
    linkdByUser: sql<boolean>`count(${userLikes.id}) > 0`
}) 
    .from(posts)
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .leftJoin(likes, eq(posts.id, likes.postId))
    .leftJoin(childPosts, eq(childPosts.parentId, posts.id))
    .leftJoin(follows, eq(follows.followedId, profiles.id))
    .leftJoin(userLikes, and(eq(userLikes.profileId,userId), eq(userLikes.postId, posts.id)),)
    .where(and(
        or(eq(follows.followerId, userId), eq(posts.profileId, userId)), 
        isNull(posts.parentId)
        ))
    .groupBy(posts.id, profiles.id)
    .orderBy(desc(posts.createdAt))

}
