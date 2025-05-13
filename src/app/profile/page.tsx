import { getCurrentProfileUsername } from "@/lib/data/profile/getProfile";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const currentUsername = await getCurrentProfileUsername();
    if (currentUsername) {
        redirect(`/profile/${currentUsername}`)
    } else {
        redirect('/login')
    }
} 