'use client'

import { useAuth } from '@/lib/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';


interface AuthFormProps {
type: 'login' | 'signup';

}

export default function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const { handleSignUp, handleLogin, loading } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (type === 'login') {
            const { success } = await handleLogin(email, password);
            if (success) {
                router.replace("/");
            }
        } 
        if (type === 'signup') {
            const { success } = await handleSignUp(email, username, password);
            if (success) {
                router.replace("/");
            }
        }
    }


    return <form
    className='flex flex-col space-y-4 p-6 md:p-6'
    onSubmit={handleSubmit}>
        {type === 'signup' && (
            <div className='flex flex-col gap-2'>
                <input
                    type='text'
                    id='username'
                    name="username"
                    placeholder='Nome de usuário'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className='rounded-2xl borded border-gray-300 p-2 text-gray-900'
                />
            </div>
        )}
            <div className='flex flex-col gap-2'>
                <input
                    type='email'
                    id='email'
                    name="email"
                    placeholder='Email de usuário'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='rounded-2xl borded border-gray-300 p-2  text-gray-900'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <input
                    minLength={6}
                    type='password'
                    id='password'
                    name="password"
                    placeholder='Senha de usuário'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='rounded-2xl borded border-gray-300 p-2  text-gray-900'
                />
            </div>
            <Button 
                classname="w-max px-8"
                loading={loading}>
                    {type === 'signup' ? 'Cadastrar' : 'Entrar'}
            </Button>
    </form>;
}
