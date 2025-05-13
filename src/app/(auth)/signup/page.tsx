import AuthForm from "@/components/auth/AuthForm";

import Link from "next/link";

export default function SignUpPage() {
    return (
        <div>
            <div className="max-w-lg mx-auto mt-12 px-6">
                <h1 className="mt-10 text-2x1">Crie a sua conta</h1>
                <div className="mt-10 mb-14 flex flex-col gap-6">
                    <AuthForm type="signup" />
                </div>
                <div className="flex flex-col gap-1 justify-center items-center md:flex-row">
                    <div className="text-gray-500">Já tem uma conta</div>
                    <Link href="/login" className="hover:underline">Entre no Twitter</Link>
                </div>
            </div>
        </div>
    );
}