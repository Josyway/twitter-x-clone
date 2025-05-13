"use client"
import { useRef } from "react";
import { LuX } from "react-icons/lu";
import NewPostForm from "./NewPost";

export default function PostModal() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    function openDialog() {
        dialogRef.current?.showModal();
    }
    function closeDialog() {
        dialogRef.current?.close();
    }
    return (
        <>
            <button className="mt-4 w-full rounded-3xl bg-blue-500 px-8 py-3 text-lg font-bold text-white hover:bg-blue-400"
                onClick={openDialog}
            >
                Post
            </button>
            <dialog ref={dialogRef} className=" relative rounded-xl p-8 md:w[600px]">
                <button 
                    className="absolute top-0 right-0 p-4 text-gray-500 hover:text-gray-400"
                    onClick={closeDialog}
                >
                    <LuX className="h-8 w-8"/>
                </button>
                <NewPostForm 
                    autoFocus
                    onPostCreated={closeDialog}
                    className="border-b-0"/>
            </dialog>
        </>
    )
}