import { getServerUserId } from "@/lib/auth/getServerUserid";
import { db, hashtags, likes, postHashtags, posts, profiles } from "@/lib/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import "server-only";

export async function getPostsByHashtag ( hashtag: string ) {
    if (!hashtag) {
        return [];
    }
    

    const userId = await getServerUserId();
    const userLikes = alias(likes, "userLikes" )
    const childPosts = alias(posts, "childPosts"); 
    const postsRecordsQuery = db
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
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagsId))
    .where(eq(hashtags.name, hashtag))
    .groupBy(posts.id, profiles.id)
    .orderBy(desc(posts.createdAt))

    
    if (userId) {
        postsRecordsQuery
        .leftJoin(userLikes, and(eq(userLikes.profileId,userId), eq(userLikes.postId, posts.id)),
            );
        }

    const postsRecords = await postsRecordsQuery;
    return postsRecords;
}
