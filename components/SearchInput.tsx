'use client';

import { useState } from 'react';

interface SearchInputProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

export default function SearchInput({ placeholder, onSearch }: SearchInputProps) {
  const [value, setValue] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onSearch(e.target.value);
  }

  function handleClear() {
    setValue('');
    onSearch('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') handleClear();
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-black/50 border border-[#00ff00]/30 rounded-lg text-[#00ff00] placeholder-[#00ff00]/40 focus:outline-none focus:border-[#00ff00]/60 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00ff00]/40 hover:text-[#00ff00] transition-colors"
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}
