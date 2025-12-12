import { useState, useEffect } from "react";
import axios from 'axios'
import '../css/homePage.css'
import { Card, CardContent, CardFooter, CardHeader } from '../componentes/card';
import { Avatar, AvatarFallback } from "../componentes/avatar";
import { SearchBar } from "../componentes/searchBar";
import { Navbar } from "../componentes/navBar";
import { useNavigate } from 'react-router-dom';
import {CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [itens, setItens] = useState([])
  const [loadingItens, setLoadingItens] = useState(true);
  const [category, setCategory] = useState('')
  const [termSearch, setTermSearch] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    async function chamaItens() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/itens", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data.content;
        console.log(data)

        // 🔍 Aplica filtros combinados (categoria + termo)
        const filtered = data.filter((item) => {
          // verifica se a categoria bate ou se não há filtro
          const matchesCategory =
            category === "" || item.categoria === category;

          // verifica se o termo digitado aparece no título ou descrição
          const matchesSearch =
            item.nome.toLowerCase().includes(termSearch.toLowerCase()) ||
            item.descricao.toLowerCase().includes(termSearch.toLowerCase());

          return matchesCategory && matchesSearch;
        });

        setItens(filtered);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
      } finally {
        setLoadingItens(false);
      }
    }

    chamaItens();
  }, [category, termSearch]);


  return (
    <>
      <header>
        <Navbar />
        <div className="searchBar">
          <SearchBar
            option={setCategory}
            termSearch={setTermSearch}
            searchValue={termSearch}
          />
        </div>

      </header>
      <main className="main-homePage">
        {loadingItens ? (
          <h1>Carregando anúncios</h1>
        ) : itens.length === 0 ? (
          <div className="no-results">
            <h2>Nenhum anúncio encontrado</h2>
            <p>Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="container-grid">
            {itens.map((element) => (
              <Card
                key={element.id}
                onClick={() => navigate(`/advertisementDetails/${element.id}`)}

              >
                <CardHeader className="position-relative">
                  <img
                    src={element.imagens[0]}
                    alt={element.nome}
                    className="card-img"
                  />
                  {element.categoria === 'Concluido' && (
                    <div className="badge-concluido">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Concluido</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div>
                    <h3>{element.nome}</h3>
                  </div>
                  <p className="card-content-p">{element.descricao}</p>
                  <div className="card-user-info">
                    <Avatar className="height-6 width-6">
                      <AvatarFallback>{element.proprietario.nome[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{element.proprietario.nome}</span>
                  </div>
                  <p className="text-sm text-gray-500">{element.endereco}</p>
                </CardContent>
                <CardFooter className="card-footer">
                  <p className="text-sm color-gray">{element.proprietario.telefone}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}


