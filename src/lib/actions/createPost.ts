"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerUserId } from "../auth/getServerUserid";
import { db, hashtags, postHashtags, posts } from "../db";
import { hashtagRegex } from "../providers/constants";

const createPostSchema = z.object({
    content: z.string().min(1).max(250),
    parentId: z.string().uuid().optional().nullable().transform((v) => v ?? undefined),
});

export async function createPost(formData: FormData) {
    try {
        const userId = await getServerUserId();
        if (!userId) {
            throw new Error("Usuário não encontrado");
        }
        const contentSubmission = formData.get("content");
        const parentIdSubmission = formData.get("parentId");
        const { content, parentId } = createPostSchema.parse({
            content: contentSubmission,
            parentId: parentIdSubmission,
        });
        await createPostRecord(userId, content, parentId);
        if (parentId) {
            revalidatePath(`/posts/${parentId}`);
        } else {
        revalidatePath("/")
        }
        return { success: true };
    } catch (error) { 
        return { success: false, error };
    }
}

function extractedHashtags(content: string) {
    return (content.match(hashtagRegex)?.map((tag) => tag.slice(1).toLocaleLowerCase().trim()) ?? []);
}

async function createPostRecord(userId: string, content: string, parentId?: string) {
    return await db.transaction(async (tx) => {
        const [newPost] = await tx
        .insert(posts)
        .values({profileId: userId, content, parentId })
        .returning();
        const hashtagsList = extractedHashtags(content);
        
        for (const hashtagName of hashtagsList) {
            const [hashtag] = await tx
            .insert(hashtags)
            .values({ id: crypto.randomUUID(), name: hashtagName })
            .onConflictDoUpdate({ 
                target: hashtags.name,
                set: { name: hashtagName },
            })
            .returning();
            await tx
            .insert(postHashtags)
            .values({ postId: newPost.id, hashtagsId: hashtag.id })
            .onConflictDoNothing({ target: [postHashtags.postId, postHashtags.hashtagsId] });;
        }
});
}

