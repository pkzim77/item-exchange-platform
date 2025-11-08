import '../css/searchBar.css'
import { Search } from 'lucide-react';
import { Input } from './input';
import { useState, useEffect } from "react";

function SearchBar({option, termSearch, searchValue}) {

    return (
        <div className='flex gap-2'>
            <div className='relative flex-1'>
                <Search className='iconSearch'> </Search>
                <Input
                    type="text"
                    placeholder="Buscar anúncios..."
                    className='pl-10'
                    value={searchValue || ''} 
                    onChange={(e) => termSearch(e.target.value)}
                />

            </div>
            <select name="" id="" onChange={(e) => option(e.target.value)}>
                <option value='' >Todas</option>
                <option value="Esportes">Esportes</option>
                <option value="Livros">Livros</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Móveis">Movéis</option>
                <option value="Instrumentos">Instrumentos</option>
                <option value="Roupas">Roupas</option>

            </select>
        </div>)

}
export { SearchBar }