'use client'
import { useAuth } from '@/lib/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuX } from 'react-icons/lu';
import { Button } from '../ui/button';


interface ProfileFormProps {
    username: string;
}

export default function ProfileForm({ username }: ProfileFormProps) {
    const { updateUser} =  useAuth()
    const [editableUsername, setEditableUsername] = useState(username);
    const [editMode, setEditMode] = useState(false);
    const router = useRouter()
    async function handleFormAction() {
        setEditMode(false);
        const {success} = await updateUser(editableUsername);
        if (success) {
            router.push(`/profile/${editableUsername}`);
        } 
    }
    function handleCancel() {
        setEditMode(false);
        setEditableUsername(username);
    }

    return (
    <>{editMode ? (<form action={handleFormAction}
        className='flex justify-between w-full items-center gap-2'
    >
        <input 
        autoFocus
        name="username"
        required
        maxLength={20}
        className='w-full rounded-3xl border border-gray-300 px-2 text-black' 
        value={editableUsername}
        onChange={(e) => setEditableUsername(e.target.value)}
        />
        <Button classname="rounded-3xl text-base font-normal">
            Salvar
        </Button>
        <div>
            <LuX role='button' onClick={handleCancel} className='h-8 w-8 text-blue-500 hover:text-gray-400 cursor-pointer'/>
        </div>
    </form>) : (
        <div className='flex justify-between w-full items-center'>
            <h1>{username}</h1>
            <button 
            className='bg-blue-500  text-white hover:bg-blue-400 text-base font-normal py-2 px-4 rounded-3xl'
            onClick={() => setEditMode(true)}>
                Editar
            </button>
        </div>
    )}
    </>
    );
}