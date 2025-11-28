import { useState, useEffect } from "react";
import axios from 'axios'
import '../css/reviewScreen.css'
import { Navbar2 } from '../componentes/navBar2';
import { Button } from '../componentes/button'
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/card';
import { Avatar, AvatarFallback } from '../componentes/avatar';
import Progress from '../componentes/progress';
import Separator from "../componentes/separator";
import { Badge } from '../componentes/badge';
import { ArrowLeft, Star, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';


export default function ReviewScreen() {

    const mockUserProfile = {
        id: 1,
        name: 'João Silva',
        phone: '(11) 98765-4321',
        location: 'São Paulo, SP',
        rating: 4.8,
        totalRatings: 24,
        memberSince: 'Janeiro 2024',
        totalNegotiations: 32,
        successRate: 94,
        ratingBreakdown: {
            5: 18,
            4: 4,
            3: 1,
            2: 1,
            1: 0
        },
        recentReviews: [
            {
                id: 1,
                rating: 5,
                comment: 'Excelente negociação! Produto exatamente como descrito.',
                reviewer: 'Maria Santos',
                date: '15/10/2025'
            },
            {
                id: 2,
                rating: 5,
                comment: 'Pessoa muito confiável e pontual. Recomendo!',
                reviewer: 'Carlos Oliveira',
                date: '10/10/2025'
            },
            {
                id: 3,
                rating: 4,
                comment: 'Boa comunicação, produto em bom estado.',
                reviewer: 'Ana Costa',
                date: '05/10/2025'
            }
        ],
    };

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [data2, setData2] = useState(null);
    const [data3, setData3] = useState(null);
    const [loading, setLoading] = useState(true);

    function getPercentage(count) {
        const total = Object.values(mockUserProfile.ratingBreakdown).reduce((acc, curr) => acc + curr, 0);
        if (total === 0) return 0;
        return (count / total) * 100;
    }


    useEffect(() => {
        async function getItem() {
            try {
                const token = localStorage.getItem("token");

                const [response, secondResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/itens/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),

                    /* axios.get(`http://localhost:8080/api/avaliacoes`, {
                         headers: { Authorization: `Bearer ${token}` },
                     }),*/
                ]);

                setData(response.data);
                /*setData2(secondResponse.data);*/


                const ownerId = response.data.proprietario.id;

                const thirdResponse = await axios.get(
                    `http://localhost:8080/api/usuarios/${ownerId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setData3(thirdResponse.data);

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        }

        getItem();
    }, [id]);

    if (loading) return <p>Carregando...</p>;
    if (!data) return <p>Item não encontrado</p>;

    return (
        <div className='body-reviewScreen'>
            <Navbar2 />
            <main className="main-reviewScreen">
                <div className='center'>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col-md-row gap-6">
                                <Avatar className="h-24 w-24 bg-light-green">
                                    <AvatarFallback className="text-2xl">{data.proprietario.nome[0]}</AvatarFallback>
                                </Avatar>

                                <div className=" flex-1 responsive-text-align flex-column">
                                    <h2 className="mb-2 font-size-inherit font-weight-inherit">{data.proprietario.nome}</h2>

                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-5 w-5 star-text-yellow-500" />
                                            <span className="text-xl">{data.proprietario.notaAvaliacao}.0</span>
                                        </div>
                                        <span className="text-gray-600">(0 avaliações)</span>
                                    </div>

                                    <div className="flex flex-col-md-row gap-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {data3.logradouro},

                                        </div>
                                        {data3.cidade}
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            {data3.telefone}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="text-center p-3 bg-light-green rounded-lg">
                                            <p className="text-2xl margin0" >0 </p>
                                            <p className="text-sm text-gray-600 margin0">Negociações</p>
                                        </div>
                                        <div className="text-center p-3 bg-light-green rounded-lg">
                                            <p className="text-2xl margin0">0%</p>
                                            <p className="text-sm text-gray-600 margin0">Taxa de Sucesso</p>
                                        </div>
                                        <div className="text-center p-3 bg-light-green rounded-lg">
                                            <p className="text-sm text-gray-600 margin0">Membro desde</p>
                                            <p className="text-sm margin0">Janeiro 2024</p>
                                        </div>
                                    </div>

                                    <Button className="btn-responsive-width">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Enviar Mensagem
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-6">
                        <CardHeader >
                            <CardTitle>Distribuição de Avaliações</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((stars) => {
                                    const count = mockUserProfile.ratingBreakdown[stars];
                                    const percentage = getPercentage(count);

                                    return (
                                        <div key={stars} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 w-12">
                                                <span className="text-sm">{stars}</span>
                                                <Star className="star-text-yellow-500" />
                                            </div>
                                            <Progress value={percentage} className="flex-1" />
                                            <span className="text-sm text-gray-600 w-8">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-6">
                        <CardHeader>
                            <CardTitle>Avaliações Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockUserProfile.recentReviews.map((review, index) => (
                                    <div key={review.id}>
                                        {index > 0 && <Separator className="mb-4" />}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{review.reviewer}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 star-text-yellow-500" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 margin0">{review.comment}</p>
                                            <p className="text-xs text-gray-500 margin0">{review.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>



    )
}