import React, { useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { esslabicon } from '../assets';

export default function FetchPaket() {
  const { data, loading, fetchInventory } = useSupabase();

  useEffect(() => {
    fetchInventory('paket'); // Kategori "paket" olanları çek
  }, []);

  if (loading)
    return (
      <div className='absolute inset-0 grid place-content-center'>
        <img
          src={esslabicon}
          alt='Loading...'
          className='w-20 h-20 animate-pulse'
        />
      </div>
    );

  return (
    <div className='h-full px-10 grid grid-rows-[100px,1fr]'>
      <h1 className='font-semibold text-3xl'>Envanter Listesi [ Paket ]</h1>
      {/* ikinci kısım */}
      <div className='grid grid-cols-2 gap-10 relative'>
        <div className='w-full '>
          <div className='grid grid-cols-3 text-xl text-green-500'>
            <th className='text-start'>Ürün Kategorisi</th>
            <th className='text-start'>Ürün Adı</th>
            <th className='text-start'>Ürün Adeti</th>
          </div>
          <div className=''>
            {data.map((item) => (
              <div key={item.id} className='grid grid-cols-3 text-lg font-semibold'>
                <td>{item.category}</td>
                <td>{item.productname}</td>
                <td>{item.productcount}</td>
              </div>
            ))}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
