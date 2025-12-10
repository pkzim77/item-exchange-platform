import React from 'react';
import { Navbar2 } from '../componentes/navBar2';
import '../css/negotiationsScreen.css'

import { useNavigate } from 'react-router-dom';
import { Button } from '../componentes/button'
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/card';
import { Badge } from '../componentes/badge';
import { Avatar, AvatarFallback } from '../componentes/avatar';
import { ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../componentes/tabs';
import axios from 'axios';
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../componentes/dialog';

export default function NegotiationsScreen() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [showReportDialog, setShowReportDialog] = useState(false);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);

    const [response, setResponse] = useState([])
    const mockNegotiations = {
        active: [
            {
                id: 1,
                adTitle: 'Bicicleta uusuusggsgsgsggsgsddsdsddsdsdsdgsggsgsggsgsgs',
                otherUser: 'Maria Santos',
                status: 'PENDENTE',
                date: '18/10/2025',
                confirmedByMe: true,
                confirmedByOther: false
            },
            {
                id: 2,
                adTitle: 'Notebook Dell i5sssssss',
                otherUser: 'Carlos Oliveira',
                status: 'PENDENTE',
                date: '17/10/2025',
                confirmedByMe: false,
                confirmedByOther: false
            }
        ],
        completed: [
            {
                id: 3,
                adTitle: 'Mesa de Escritório',
                otherUser: 'Ana Costa',
                status: 'FINALIZADA',
                date: '15/10/2025',
                confirmedByMe: true,
                confirmedByOther: true
            },
            {
                id: 4,
                adTitle: 'Violão Tagima',
                otherUser: 'Pedro Alves',
                status: 'FINALIZADA',
                date: '12/10/2025',
                confirmedByMe: true,
                confermedByOther: true
            }
        ],
        cancelled: [
            {
                id: 5,
                adTitle: 'Roupas Infantis',
                otherUser: 'Juliana Lima',
                status: 'REJEITADA',
                date: '10/10/2025',
                confirmedByMe: false,
                confirmedByOther: false
            }
        ]
    };

    useEffect(() => {
        async function getNegotiation() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:8080/api/negociacoes/historico', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const negotiationUser = response.data.filter(
                    neg => neg.item.proprietario.id === user.id
                );
                setResponse(negotiationUser)
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }


        }

        getNegotiation();

    }, []);

    async function confirmNegotiation(negotiationId, itemId) {
        try {
            console.log(itemId)
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:8080/api/negociacoes/${negotiationId}/confirmar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const req2 = await axios.delete(`http://localhost:8080/api/itens/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            Swal.fire({
                title: 'Sucesso',
                text: 'Negociação finalizada!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) { 
                    navigate(0); 
                }
            })
        } catch (error) {
            console.log(error)
            const msg = error.response?.data?.message || error.response?.data || 'Erro desconhecido';

            if (typeof msg === 'string') {
                if (msg.includes('O proprietário já confirmou.')) {
                    return Swal.fire({
                        title: 'O produto já foi trocado!',
                        text: 'O proprietário confirmou a troca',
                        icon: 'warning',
                        confirmButtonText: 'Ok'
                    });
                }

            }
        }

    }

    async function cancelNegotiation(negotiationId, itemId) {
        try {
            const token = localStorage.getItem("token");
            const req = await axios.patch(`http://localhost:8080/api/negociacoes/${negotiationId}`, {
                status: 'rejeitada'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

        } catch (error) {
            console.log(error)
        }

    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDENTE':
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Em andamento</Badge>;
            case 'FINALIZADA':
                return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Concluída</Badge>;
            case 'REJEITADA':
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelada</Badge>;
            default:
                return null;
        }
    };

    // Versão DESKTOP do card
    const renderDesktopCard = (negotiation) => (
        <Card className="mb-4 visible-desktop">
            <CardContent className="p-4">
                <div className="flex justify-between">
                    <div className='flex flex-col-md min-w-0'>
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                                src={negotiation.item.imagens[0]}
                                alt={negotiation.item.nome}
                                className="w-full h-full object-fill"
                            />
                        </div>
                        <div className="ml-4-responsive pt-4 flex-1 flex-col min-w-0">
                            <h3 className="margin0 mb-1 pl-1-responsive w-full truncate">{negotiation.item.nome}</h3>
                            <p className="text-sm text-gray-600 margin0 mb-1 pl-1-responsive">Data inicial: {negotiation.dataCriacao}</p>
                            <div className="flex items-center gap-1 mb-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{negotiation.comprador.nome[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{negotiation.comprador.nome}</span>
                            </div>
                        </div>
                    </div>

                    <div className='y'>
                        {getStatusBadge(negotiation.status)}

                        {negotiation.status === 'PENDENTE' && (
                            <div className="flex gap-2 flex-col pt-4">
                                <div className='gap-2 flex'>
                                    <Button variant="outline" size="sm">
                                        Editar
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => cancelNegotiation(negotiation.id)}>
                                        Excluir
                                    </Button>
                                </div>
                                <div>
                                    <Button size="sm" onClick={() => confirmNegotiation(negotiation.id, negotiation.item.id)}>
                                        Confirmar Troca
                                    </Button>
                                    <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex-1">
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Confirmar troca
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
                                                <Button onClick={() => confirmNegotiation(negotiation.id, negotiation.item.id)}>Confirmar</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {negotiation.status === 'FINALIZADA' && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800 mt-3">
                        Troca concluída com sucesso! Ambas as partes confirmaram.
                    </div>
                )}
            </CardContent>
        </Card>
    );

    // Versão MOBILE do card
    const renderMobileCard = (negotiation) => (
        <Card className="mb-4 visible-mobile">
            <CardContent className="p-4">
                <div className='flex flex-end mb-1'>
                    {getStatusBadge(negotiation.status)}
                </div>
                <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                        src='https://plus.unsplash.com/premium_photo-1678718713393-2b88cde9605b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlrZXxlbnwwfHwwfHx8MA%3D%3D'
                        alt={negotiation.item.nome}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex justify-between">
                    <div className='flex flex-col-md min-w-0'>
                        <div className="ml-4-responsive pt-4 flex-1 flex-col min-w-0">
                            <h3 className="margin0 mb-1 pl-1-responsive w-full truncate">{negotiation.item.nome}</h3>
                            <p className="text-sm text-gray-600 margin0 mb-1 pl-1-responsive">Data: {negotiation.dataCriacao}</p>
                            <div className="flex items-center gap-1 mb-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{negotiation.comprador.nome[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{negotiation.comprador.nome}</span>
                            </div>
                        </div>
                    </div>

                    <div className='y'>
                        {response.status === 'PENDENTE' && (
                            <div className="flex gap-2 flex-col pt-4">
                                <div className='gap-2 flex'>
                                    <Button variant="outline" size="sm">
                                        Editar
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => cancelNegotiation(negotiation.id)}>
                                        Excluir
                                    </Button>
                                </div>
                                <div>
                                    <Button size="sm">
                                        Confirmar Troca
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {response.status === 'FINALIZADA' && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
                        Troca concluída com sucesso! Ambas as partes confirmaram.
                    </div>
                )}
            </CardContent>
        </Card>
    );

    // Renderiza ambas as versões
    const renderNegotiationCard = (negotiation) => (
        <React.Fragment key={negotiation.id}>
            {renderDesktopCard(negotiation)}
            {renderMobileCard(negotiation)}
        </React.Fragment>
    );

    const pendente = response.filter(n => n.status === "PENDENTE");
    const finalizada = response.filter(n => n.status === "FINALIZADA");
    const rejeitada = response.filter(n => n.status === "REJEITADA");

    return (
        <div className='body-reviewScreen'>
            <header>
                <Navbar2 />
            </header>
            <main className="main-reviewScreen">
                <div className='center'>
                    <Tabs defaultValue="active">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="active">
                                Em Andamento
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Concluídas
                            </TabsTrigger>
                            <TabsTrigger value="cancelled">
                                Canceladas
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="active">
                            {pendente.length > 0 ? (
                                pendente.map(renderNegotiationCard)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Nenhuma negociação em andamento
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="completed">
                            {finalizada.length > 0 ? (
                                finalizada.map(renderNegotiationCard)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Nenhuma negociação em andamento
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="cancelled">
                            {rejeitada.length > 0 ? (
                                rejeitada.map(renderNegotiationCard)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Nenhuma negociação em andamento
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}