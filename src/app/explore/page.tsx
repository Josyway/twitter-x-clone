import HashtagSearchInput from "@/components/explore/HashtagSearchInput";
import Header from "@/components/layout/Header";
import Post from "@/components/post/Post";
import BlockSpinner from "@/components/ui/BlockSpinner";
import { getPostsByHashtag } from "@/lib/data/posts/getPostsByHashtag";
import { Suspense } from "react";
import { LuSearch } from "react-icons/lu";

interface ExplorePageProps {
    searchParams: {
        h?: string;
    };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
    const { h: hashtag } = searchParams;
    const parsedHashtag = hashtag ? decodeURIComponent(hashtag): undefined;

    return (
        <div className="w-full">
            <Header hasBackButton>
                <div className="flex w-full items-center justify-between">
                    <LuSearch className="h-6 w-6 text-gray-200" />
                    <HashtagSearchInput hashtagParam={parsedHashtag} />
                </div>
            </Header>
            <Suspense fallback={<BlockSpinner />} key={hashtag}>
            <PostLoader hashtag={parsedHashtag} />
            </Suspense>
        </div>
    )
}

interface PostLoaderProps {
    hashtag?: string;
}

async function PostLoader({ hashtag }: PostLoaderProps) {
    const posts = await getPostsByHashtag(hashtag || "");
    return posts.map((post) => <Post key={post.postId} {... post} hasLink/>);
}

