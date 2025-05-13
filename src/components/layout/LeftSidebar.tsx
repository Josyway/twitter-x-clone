import Link from "next/link";
import { LuSparkle } from "react-icons/lu";
import PostModal from "../post/PostModal";
import Nav from "./Nav";

export default function LeftSidebar() {
    return (
        <aside className="hidden w-1/4 overflow-y-auto border-r border-gray-200 p-6 md:sticky md:block h-screen xl:w-1/5">
            <Link className="md-8 block" href="/">
                <LuSparkle className="h-8 w-8 text-gray-200" />
            </Link>
            <Nav />
            <PostModal />
        </aside>
    );
}