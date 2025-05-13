'use client'

import React from 'react';
import { hashtagRegex } from "@/lib/providers/constants";
import { useRouter } from "next/navigation";

interface PostContentProps {
    content: string
}

export default function PostContent({ content }: PostContentProps) {
    const router = useRouter();
    
    function parseContent(text: string, routerInstance: ReturnType<typeof useRouter>) { 
        const parts = text.split(hashtagRegex);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <span
                        role="link"
                        key={index}
                        onClick={e => {
                            e.preventDefault();
                            routerInstance.push(`/explore?h=${encodeURIComponent(part)}`)
                        }}
                        className="cursor-pointer text-blue-500 hover:underline"
                    >
                        #{part}
                    </span>
                );
            } else {
                return part;
            }
        });
    }

    return <p className="mb-2">{parseContent(content, router)}</p>
}
