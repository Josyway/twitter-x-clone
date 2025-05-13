'use client'

import Avatar from "@/components/ui/Avatar";
import { createPost } from "@/lib/actions/createPost";
import { RequiresAuth } from "@/lib/auth/RequiresAuth";
import { useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "../../lib/providers/AuthProvider";
import { Button } from "../ui/button";

interface NewPostFormProps {
    className?: string;
    parentId?: string;
    autoFocus?: boolean
    onPostCreated?: () => void;

}

export default function NewPostForm({ className, parentId, autoFocus = false, onPostCreated }: NewPostFormProps) {
    const { user } = useAuth();
    const ref = useRef<HTMLFormElement>(null);
    async function handleFormAction(formData: FormData) {
        const { success } = await createPost(formData);
        if (success) {
            toast("Post criado com sucesso")
            if (onPostCreated) {
                onPostCreated();
            }
            ref?.current?.reset();
        } else {
            toast.error("Erro ao criar post");
        }
    }
    return (
        <form 
        action={handleFormAction}
        ref={ref}
        className={`border-b border-gray-200 p-4 ${className}`}>
            <div className="mb-4 flex w-full items-start gap-4">
                <Avatar username={user?.user_metadata?.username} profileId={user?.id}/>
                <textarea 
                name="content" 
                required 
                autoFocus={autoFocus} 
                maxLength={250}
                rows={3}
                placeholder="O que está acontecendo"
                className="w-full rounded-lg p-2 text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-950"
                />
                {parentId && <input type="hidden" name="parentId" value={parentId} />}
            </div>
            <div className="flex justify-end">
                <RequiresAuth as="div">
                    <Button classname="w-max px-8">Postar</Button>
                </RequiresAuth>
            </div>
        </form>

    );
}