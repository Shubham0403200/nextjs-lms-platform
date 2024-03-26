"use client"

import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import qs from 'query-string'
import { useDebounce } from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SearchInput = () => {

    const [ value, setValue ] = useState("");
    const debounceValue = useDebounce(value);
    const search = useSearchParams();
    const router = useRouter();
    const pathname  = usePathname();

    const courseCategoryId = search.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname, 
            query: {
                categoryId: courseCategoryId,
                title: debounceValue,
            }
        }, {skipEmptyString: true, skipNull: true});

        router.push(url);
    }, [debounceValue, courseCategoryId, router, pathname])

  return (
    <div className='relative' > 
        <Search 
            className='h-4 w-4 absolute top-3 left-3 text-slate-600 '
        />
        <Input 
            className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200 '
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    </div>
  )
}

export default SearchInput