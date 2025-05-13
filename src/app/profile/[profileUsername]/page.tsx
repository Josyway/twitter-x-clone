import Header from "@/components/layout/Header";
import Post from "@/components/post/Post";
import FollowButton from "@/components/profile/FollowButton";
import ProfileForm from "@/components/profile/ProfileForm";
import Avatar from "@/components/ui/Avatar";
import BlockSpinner from "@/components/ui/BlockSpinner";
import { getProfileByUserName } from "@/lib/data/profile/getProfile";
import { getProfilePosts } from "@/lib/data/profile/getProfilePosts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

interface ProfileUsernamePageProps {
    params: { 
        profileUsername: string;
    };
    searchParams: {tab?: string}
}

const tabsSchema = z.enum(["posts", "replies"]).optional().default("posts");

export default async function ProfileUsernamePage({ params: { profileUsername }, searchParams}: ProfileUsernamePageProps) {
    const result = tabsSchema.safeParse(searchParams?.tab);
    if (!result.success) {
        return notFound();
    }
    const tab = result.data;

    const parsedUsername = decodeURIComponent(profileUsername)
    const { profile, isOwnProfile } = await getProfileByUserName(parsedUsername);
    if (!profile) {
        notFound();
    }
    return (
        <div>
            <Header hasBackButton>
                <div className="flex w-full items-center gp-2">
                    <Avatar 
                    username={profile.username}
                    profileId={profile.id}
                    link={false}
                    />
                    {!isOwnProfile && (
                        <div className="flex w-full items-center justify-between">
                            <h1>{parsedUsername}</h1>
                            <FollowButton 
                            profileId={profile.id} 
                            followedByUser={!!profile.followedByUser}
                            username={profile.username}
                            />
                        </div>
                    )}
                    {isOwnProfile && <ProfileForm username={profile.username} />}
                </div>
            </Header>
            <div className="grid grid-cols-2 justify-between border-b border-gray-200">
                <Link className={`p-4 text-center ${tab === "posts" ? "text-blue-500 font-bold" : ""}`} 
                href={`/profile/${profile.username}?tab=posts`}>Posts</Link>
                <Link className={`p-4 text-center ${tab === "replies" ? "text-blue-500 font-bold" : ""}`}
                href={`/profile/${profile.username}?tab=replies`}>Respostas</Link>
            </div>
            <Suspense fallback={<BlockSpinner />} key={tab}>
                {tab === "posts" && <Posts username={profile.username} />}
                {tab === "replies" && <Replies username={profile.username} />}
            </Suspense>
        </div>
    )
}

async function Posts({username}: {username: string}) {
    const posts = await getProfilePosts(username, "posts");
    return posts.map((post) => <Post key={post.postId} {...post} hasLink/>)
}

async function Replies({username}: {username: string}) {
    const posts = await getProfilePosts(username, "replies");
    return posts.map((post) => <Post key={post.postId} {...post} hasLink linksToParent/>)
}