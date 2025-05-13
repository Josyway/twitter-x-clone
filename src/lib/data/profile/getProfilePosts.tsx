import { getServerUserId } from "@/lib/auth/getServerUserid";
import { db, likes, posts, profiles } from "@/lib/db";
import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import "server-only";

export async function getProfilePosts ( username: string, type: "posts" | "replies" ) {
    const userId = await getServerUserId();
    const userLikes = alias(likes, "userLikes" )
    const childPosts = alias(posts, "childPosts"); 
    const profilePostQuery = db
    .select({
    postId: posts.id,
    content: posts.content,
    createdAt: posts.createdAt,
    profileId: posts.profileId,
    username: profiles.username,
    parentId: posts.parentId,
    likeCount: sql<number>`CAST(COUNT(DISTINCT${likes.id}) as int)`,
    commentCount: sql<number>`CAST(COUNT(DISTINCT${childPosts.id}) as int)`,
    ...(userId 
        ? {linkdByUser: sql<boolean>`count(${userLikes.id}) > 0`}
        : {})
}) 
    .from(posts)
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .leftJoin(likes, eq(posts.id, likes.postId))
    .leftJoin(childPosts, eq(childPosts.parentId, posts.id))
    .groupBy(posts.id, profiles.id)
    .orderBy(desc(posts.createdAt))

    
    if (userId) {
        profilePostQuery
        .leftJoin(userLikes, and(eq(userLikes.profileId,userId), eq(userLikes.postId, posts.id)),
            );
        }

    if (type === "posts") {
        profilePostQuery.where(
            and(isNull(posts.parentId), eq(profiles.username, username))
        );
    } else {
        profilePostQuery.where(
            and(isNotNull(posts.parentId), eq(profiles.username, username)))
    }  
    const profilePosts = await profilePostQuery;
    return profilePosts;
}
