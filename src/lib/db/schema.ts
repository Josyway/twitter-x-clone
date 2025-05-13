import { Relations } from "drizzle-orm";
import { foreignKey, index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles",{
    id: uuid("id").primaryKey().notNull(),
    username: text("username").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    profileId: uuid("profile_id").notNull().references(()=> profiles.id),
    parentId: uuid("parent_id"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        parentReference: foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: "posts_parent_id_fkey",
        }),
        createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
        profileIdIdx: index("posts_profile_id_idx").on(table.profileId),
        parentIdIdx: index("posts_parent_id_idx").on(table.parentId),
    };
});

export const likes = pgTable("likes", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    profileId: uuid("profile_id").notNull().references(()=> profiles.id),
    postId: uuid("post_id").notNull().references(()=> posts.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    }, (table) => {
        return {
            profileIdIdx: index("likes_profile_id_idx").on(table.profileId),
            postIdIdx: index("likes_posts_id_idx").on(table.postId),
        };
    },
);

export const follows = pgTable("follows", {
    followerId: uuid("follower_id").notNull().references(()=> profiles.id),
    followedId: uuid("followed_id").notNull().references(()=> profiles.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
            pk: primaryKey({columns: [table.followerId, table.followedId]}),
            followerIdIdx: index("follows_follower_id_idx").on(table.followerId),
            followedIdIdx: index("follows_followed_id_idx").on(table.followedId),
        };
    },
);

export const hashtags = pgTable("hashtags",{
    id: uuid("id").primaryKey().notNull(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postHashtags = pgTable("post_hashtags", {
    postId: uuid("post_id").notNull().references(()=> posts.id),
    hashtagsId: uuid("hashtag_id").notNull().references(()=> hashtags.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
            pk: primaryKey({columns: [table.postId, table.hashtagsId]}),
            postIdIdx: index("posts_hashtags_post_id_idx").on(table.postId),
            hashtagsIdIdx: index("posts_hashtags_hashtag_id_idx").on(table.hashtagsId),
        };
    },
);

export const postsRelations = new Relations(posts, ({ one, many }) => ({
    profile: one(profiles, {
        fields: [posts.profileId],
        references: [profiles.id],
    }),
    parent: one(posts, {
        fields: [posts.parentId],
        references: [posts.id],
    }),
    Children: many(posts),
    likes: many(likes),
    hashtags: many(postHashtags)
}));

export const likesRelations = new Relations(likes, ({ one }) => ({
    profile: one(profiles, {
        fields: [likes.profileId],
        references: [profiles.id],
    }),
    post: one(posts, {
        fields: [likes.postId],
        references: [posts.id],
    }),
}));

export const followsRelations = new Relations(follows, ({ one }) => ({
    follower: one(profiles, {
        fields: [follows.followerId],
        references: [profiles.id],
        relationName: "following"
    }),
    followed: one(profiles, {
        fields: [follows.followedId],
        references: [profiles.id],
        relationName: "followedBy"
    }),
}));

export const hashtagsRelations =  new Relations(hashtags, ({ many }) => ({
    posts: many(postHashtags),
}));

export const postHashtagsRelations =  new Relations(postHashtags, ({ one }) => ({
    post: one(posts, {
        fields: [postHashtags.postId],
        references: [posts.id],
    }),
    hashtag: one(hashtags, {
        fields: [postHashtags.hashtagsId],
        references: [hashtags.id],
    }),
}));