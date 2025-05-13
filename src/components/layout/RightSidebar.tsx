import { db, follows, hashtags, postHashtags, profiles } from "@/lib/db";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";

async function getTopHashtags() {
    const results = await db.select({
        name: hashtags.name, 
        count: sql<number>`CAST(COUNT(${postHashtags.postId}) as int)`, 
    })
        .from(hashtags)
        .innerJoin(postHashtags, eq(hashtags.id, postHashtags.hashtagsId)) 
        .groupBy(hashtags.id) 
        .orderBy(desc(sql`count`)) 
        .limit(5); 

    return results.map(row => ({
        name: row.name,
        count: row.count,
    }));
}

async function getTopProfiles() {
    try {
        const results = await db.select({
            username: profiles.username,
            id: profiles.id,
            followerCount: sql<number>`CAST(COUNT(${follows.followedId}) as int) as followerCount`,
        })
            .from(profiles)
            .leftJoin(follows, eq(profiles.id, follows.followerId))
            .groupBy(profiles.id)
            .orderBy(desc(sql`followerCount`))
            .limit(5);

        return results.map(row => ({
            username: row.username,
            followerCount: row.followerCount,
            id: row.id
        }));
    } catch (error) {
        console.error("Erro ao buscar top perfis:", error);
        return [];
    }
}

export default async function RightSidebar() {
    const [topHashtags] = await Promise.all([getTopHashtags()]);
    const [topProfiles] = await Promise.all([getTopProfiles()]); 

    return (
        <aside
            className="hidden w-1/4 overflow-y-auto p-4 md:sticky md:block h-screen xl:w-1/5">
            <section className="md-4 rounded-lg bg-gray-900 p-4 mb-2" >
                <h2 className="md-2 text-xl font-bold">{`O que está acontecendo`}</h2>
                <ul>
                    {topHashtags.map(hashtag => (
                        <li key={hashtag.name} className="flex flex-wrap gap-2">
                            <Link href={`/explore?h=${hashtag.name}`} className="hover:underline text-blue-400">
                                #{hashtag.name}
                            </Link>
                            <span>({hashtag.count})</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="md-4 rounded-lg bg-gray-900 p-4 mb-2">
                <h2 className="md-2 text-xl font-bold">{`Quem seguir`}</h2>
                <ul>
                    {topProfiles.map(profile => (
                        <li key={profile.id} className="flex flex-wrap gap-2">
                            <Link href={`/profile/${profile.username}`} className="hover:underline text-blue-400">
                                {profile.username}
                            </Link>
                            <span>({profile.followerCount})</span>
                        </li>
                    ))}
                </ul>
            </section>
        </aside>
    );
}