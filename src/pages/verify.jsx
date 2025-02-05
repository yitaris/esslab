import React from 'react'
import { useAuth } from '../context/SupabaseContext';

export default function verify() {
  const { signOut } = useAuth();
  return (
    <div className='w-full h-screen flex flex-col gap-10 justify-center items-center bg-white '>
        <h1 className='text-2xl font-bold'>Giriş Yetkiniz Bulunmamaktadır</h1>
        <button onClick={signOut} className='bg-red-500 text-white px-4 py-2 rounded-md'>Çıkış Yap</button>
    </div>
  )
}
