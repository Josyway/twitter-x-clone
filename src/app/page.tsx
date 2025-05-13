import Header from "@/components/layout/Header";
import NewPostForm from "@/components/post/NewPost";
import Post from "@/components/post/Post";
import { getFeed } from "@/lib/data/posts/getFeed";

export default async function Home() {
  const feed = await getFeed()
  return (
    <>
      <Header>
          <h1>Home</h1>
      </Header>
      <NewPostForm />
      {feed.map((post) => (
        <Post key={post.postId} hasLink {...post}/>
      ))}
    </>
  );
}
