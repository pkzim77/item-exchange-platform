import { Navbar2 } from '../componentes/navBar2';
import { ArrowLeft, MapPin, Phone, MessageSquare, Star, Flag, CheckCircle2 } from 'lucide-react';
import '../css/advertisementDetailsScreen.css'
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../componentes/card';
import { Badge } from '../componentes/badge'
import { Avatar, AvatarFallback } from "../componentes/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../componentes/carousel';
import { Button } from '../componentes/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../componentes/dialog';

export default function AdvertisementDetailsScreen() {

    const imagens = [
        "https://plus.unsplash.com/premium_photo-1678718713393-2b88cde9605b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlrZXxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmlrZXxlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1678718712069-4cd5ddc8819c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJpa2V8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1496147539180-13929f8aa03a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJpa2V8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/uploads/14122621859313b34d52b/37e28531?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJpa2V8ZW58MHx8MHx8fDA%3D"
    ]

    const navigate = useNavigate();

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [reportReason, setReportReason] = useState('');
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);

    useEffect(() => {
        async function getItem() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8080/api/itens/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar item:", error);
            } finally {
                setLoading(false);
            }
        }
        getItem();
    }, [id]);

    if (loading) return <p>Carregando...</p>;
    if (!data) return <p>Item não encontrado</p>;

    return (
        <div className='body-advertisementDetailsScreen'>
            <header>
                <Navbar2 />
            </header>
            <main className='main-createAdvertisementScreen'>
                <div className='center'>
                    <Card className='card-advertisementDetailsScreen'>
                        <CardContent className='cardContent-advertisementDetailsScreen flex items-start justify-between mb-4'>
                            <Carousel className="mb-6">
                                <CarouselContent>
                                    {data.imagens.map((element, index) => (
                                        <CarouselItem key={index}>
                                            <img
                                                src={element}
                                                alt={`${data.nome} - Imagem ${index + 1}`}
                                                className="imagem-carrossel"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-4" />
                                <CarouselNext className="right-4" />
                            </Carousel>
                            <div>
                                <h2 className="margin0 mb-2">{data.nome}</h2>
                                <Badge className="mb-2" variant="secondary">{data.categoria}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <MapPin className="h-4 w-4" />
                                <span>{data.endereco}</span>
                            </div>
                            <div className="mb-6">
                                <h3 className="margin0 mb-2">Descrição</h3>
                                <p className="text-gray-700 margin0">{data.descricao}</p>
                            </div>

                            <Card className="bg-gray-50 mb-6 w-full" onClick={() => navigate(`/reviewScreen/${id}`)}>
                                <CardContent className="p-4">
                                    <h3 className="margin0 mb-3">Anunciante</h3>
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="flex items-center gap-3 cursor-pointer"
                                        >
                                            <Avatar>
                                                <AvatarFallback>{data.proprietario.nome[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className='margin0 p-v-1'>{data.proprietario.nome}</p>
                                                <div className="flex items-center gap-1 text-sm">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <Star
                                                            key={i}
                                                            className={i <= data.proprietario.notaAvaliacao ? "star-text-yellow-500" : "star-text-white"}
                                                            fill={i <= data.proprietario.notaAvaliacao ? "currentColor" : "none"}
                                                        />
                                                    ))}
                                                    <span>{data.proprietario.notaAvaliacao}.0 </span>
                                                    {/*<span className="text-gray-500">({mockAdDetails.advertiser.totalRatings} avaliações)</span>*/}
                                                    <span>(0 avaliações)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4" />
                                            <span>{data.proprietario.telefone}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-3 w-full">
                                <Button className="flex-1" >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Iniciar Conversa
                                </Button>
                                <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="flex-1">
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Troca Feita
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className='margin0'>Confirmar Troca</DialogTitle>
                                            <DialogDescription className='margin0 mb-2'>
                                                Você tem certeza que a troca foi concluída? O anúncio será removido após a confirmação de ambas as partes ou se o anunciante confirmar a troca.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                                                Cancelar
                                            </Button>
                                            <Button>Confirmar</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>



    )
}