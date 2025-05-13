import { likePost, unlikePost } from "@/lib/actions/likePost";
import { RequiresAuth } from "@/lib/auth/RequiresAuth";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { LuHeart } from "react-icons/lu";

interface LikeCountProps {
    likeCount: number;
    likedByUser: boolean;
    postId: string;
}

export default function LikeCount({ likeCount, likedByUser, postId }: LikeCountProps) {
    const pathname = usePathname()
    const [, startTransition] = useTransition()
    const [optimisticLikeCount, setOptimisticLikeCount] = useOptimistic(likeCount)
    const [optimisticLikeByUser, setOptimisticLikeByUser] = useOptimistic(likedByUser)

    function likeOrDislikePost(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        startTransition( async () => {
            if (optimisticLikeByUser) {
                setOptimisticLikeByUser(false);
                setOptimisticLikeCount(optimisticLikeCount - 1);
                await unlikePost(postId, pathname);
            } else {
                setOptimisticLikeByUser(true);
                setOptimisticLikeCount(optimisticLikeCount + 1);
                await likePost(postId, pathname);
            }
        }) 
    }
    return (
        <div className="flex">
            <RequiresAuth className="flex items-center" onClick={likeOrDislikePost}>
                <LuHeart className={`mr-1 h-5 w-5 ${optimisticLikeByUser ? "fill-red-500" : "hover:fill-red-400"}`} />
            </RequiresAuth>
            <span>{optimisticLikeCount}</span>
        </div>
    );
};