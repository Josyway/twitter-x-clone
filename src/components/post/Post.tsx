"use client";

import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuMessageCircle } from "react-icons/lu";
import ProfileLink from "../profile/ProfileLink";
import LikeCount from "./LikeCount";
import PostContent from "./PostContent";
import SharePost from "./SharePost";

interface PostProps {
    profileId: string;
    username: string;
    content: string;
    commentCount: number;
    likeCount: number;
    postId: string;
    parentId?:string | null;
    likedByUser?: boolean;
    hasLink?: boolean;
    linksToParent?: boolean
}

export default function Post(props: PostProps) {
    if(props.hasLink) {
        return (
            <Link href={`/post/${props.postId}`}>
                <PostItemContent {...props} />
            </Link>
        )
    }
    return <PostItemContent {...props} />
}

function PostItemContent({postId, username, content, commentCount, likeCount, likedByUser, profileId, hasLink, parentId, linksToParent, }: PostProps) {
    const router = useRouter();
    function handleParentLinkClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/post/${parentId}`);
    }
    return (
        <div className={`flex border-b border-gray-200 p-4 ${hasLink ? "hover:bg-gray-600" : ""}`}>
            <Avatar username={username} profileId={profileId} />
            <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                    <ProfileLink className="flex items-center gap-2" username={username}>
                        <span className="text-gray-500">@{username}</span>
                    </ProfileLink>
                    {linksToParent && parentId && (
                        <div 
                        onClick={handleParentLinkClick}
                        role="link"
                        className="text-xs italic text-gray-300 hover:underline cursor-pointer"
                        >
                            <span>@respondeu</span>
                        </div>)} 
                </div>
                <PostContent content={content} />
                <div className="flex justify-between text-gray-200">
                    <button className="flex items-center">
                        <LuMessageCircle className="mr-1 h-5 w-5" />
                        <span>{commentCount}</span>
                    </button>
                    <LikeCount likeCount={likeCount} likedByUser={!!likedByUser} postId={postId}/>
                    <SharePost postId={postId}/>
                </div>            
            </div>
        </div>
    )
}