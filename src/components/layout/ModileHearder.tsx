import Link from "next/link";
import { LuSparkle } from "react-icons/lu";

export default function MobileHearder() {
    return (
        <header className="fixed flex h-14 w-full items-center justify-center border-b border-gray-200 bg-black p-4 md:hidden">
            <div>
                <div className="absolute left-4 top-3">
                    <div className="aspect-square h-8 w-8 rounded-full bg-gray-200"/>
                </div>
            </div>
            <Link href={"/"}>
                <LuSparkle className="h-8 w-8 text-gray-200" />
            </Link>
        </header>
    );
}