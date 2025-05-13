import { getServerUserId } from "@/lib/auth/getServerUserid";
import { db, likes, posts, profiles } from "@/lib/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import "server-only";

export async function getPostDetails(postId: string) {
    const userId = await getServerUserId();
    const userLikes = alias(likes, "userLikes" )
    const childPosts = alias(posts, "childPosts");    
    const postQuery = db
        .select({
        postId: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        profileId: posts.profileId,
        username: profiles.username,
        likeCount: sql<number>`CAST(COUNT(DISTINCT ${likes.id}) as int)`,
        ...(userId 
            ? {linkdByUser: sql<boolean>`count(${userLikes.id}) > 0`}
            : {})
    }) 
    .from(posts)
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .leftJoin(likes, eq(posts.id, likes.postId))
    .where(eq(posts.id, postId))
    .groupBy(posts.id, profiles.id)

    if (userId) {
        postQuery.leftJoin(userLikes, and(eq(userLikes.profileId,userId), eq(userLikes.postId, posts.id)),
        );
    }
    const repliesQuery = db
    .select({
    postId: posts.id,
    content: posts.content,
    createdAt: posts.createdAt,
    profileId: posts.profileId,
    username: profiles.username,
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
.where(eq(posts.parentId, postId))
.groupBy(posts.id, profiles.id)
.orderBy(desc(posts.createdAt))

    
if (userId) {
    repliesQuery.leftJoin(userLikes, and(eq(userLikes.profileId,userId), eq(userLikes.postId, posts.id)),
    );
}
const [postResult, repliesResult] = await Promise.all([postQuery, repliesQuery])
const [post] = postResult;
    return {post, replies: repliesResult}
}