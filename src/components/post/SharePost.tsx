import { LuShare } from "react-icons/lu";
import { toast } from "sonner";

interface SharePostProps {
    postId: string     
}

export default function SharePost({ postId }: SharePostProps) {
    function copyPermalink(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        const permalink = window.location.origin + "/post/" + postId;
        try {
            navigator.clipboard.writeText(permalink);
            toast("Link copiado com sucesso!")
        } catch (e) {
            console.error("falha ao copiar link");
        }
    }

    return (
        <button onClick={copyPermalink}>
            <LuShare className="h-5 w-5"/>
        </button>
    )
    
}