"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface HashtagSearchInputProps {
    hashtagParam?: string
}

export default function HashtagSearchInput({ hashtagParam }: HashtagSearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [hashtag, setHashtag] = useState("");

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (hashtag) {
            newParams.set("h",(hashtag));
        } else {
            newParams.delete("H");
        }
        router.push(`?${newParams.toString()}`)
    }, [hashtag, router, searchParams]);

    useEffect(() => {
        if (hashtagParam) {
            setHashtag(hashtagParam);
        }
    }, [hashtagParam]);

    return (
        <input 
        autoFocus
        type="text"
        value={hashtag}
        onChange={(e) => setHashtag(e.target.value)}
        placeholder="Pesquisar por hashtags"
        className="ml-2 w-full rounded-lg bg-transparent pl-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        
        />
    )
}