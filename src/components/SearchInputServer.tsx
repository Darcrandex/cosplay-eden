'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cls } from '@/utils/cls';
import { CircleX, Search } from 'lucide-react';

export default function SearchInputServer({ keyword = '' }: { keyword?: string }) {
  const [searchTerm, setSearchTerm] = useState(keyword);
  const router = useRouter();

  useEffect(() => {
    setSearchTerm(keyword);
  }, [keyword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (searchTerm.trim()) {
      url.searchParams.set('keyword', searchTerm.trim());
    } else {
      url.searchParams.delete('keyword');
    }
    url.searchParams.delete('page');
    
    router.replace(url.pathname + url.search);
  };

  const handleClear = () => {
    setSearchTerm('');
    const url = new URL(window.location.href);
    url.searchParams.delete('keyword');
    url.searchParams.delete('page');
    router.replace(url.pathname + url.search);
  };

  return (
    <div className={cls('relative mx-auto my-6 w-xl')}>
      <Search className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 text-gray-400" />

      <form onSubmit={handleSubmit} className="block w-full">
        <input
          type="text"
          placeholder="type and press enter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 indent-8 text-lg text-gray-800 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500"
          maxLength={20}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />
      </form>

      {!!searchTerm && (
        <CircleX
          className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-500"
          onClick={handleClear}
        />
      )}
    </div>
  );
}