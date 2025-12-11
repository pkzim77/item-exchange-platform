import React from 'react';
import { Navbar2 } from '../componentes/navBar2';
import '../css/negotiationsScreen.css'

import { useNavigate } from 'react-router-dom';
import { Button } from '../componentes/button'
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/card';
import { Badge } from '../componentes/badge';
import { Avatar, AvatarFallback } from '../componentes/avatar';
import { CircleOff, CheckCircle2, Clock, XCircle, Trash2, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../componentes/tabs';
import axios from 'axios';
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../componentes/dialog';

export default function NegotiationsScreen() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const [response, setResponse] = useState([])

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        address: "",
    });

    const [imagensBase64, setImagensBase64] = useState([]);

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

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const base64List = [];

        for (const file of files) {
            const reader = new FileReader();
            const base64 = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
            base64List.push(base64);
        }

        setImagensBase64(base64List);
    };

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

    async function cancelNegotiation(negotiationId) {
        try {
            const token = localStorage.getItem("token");
            const req = await axios.patch(`http://localhost:8080/api/negociacoes/${negotiationId}`, {
                status: 'rejeitada'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            Swal.fire({
                title: 'Negociação Cancelada',
                text: 'A negociação foi cancelada com sucesso!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(0);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteItem(itemId) {
        try {
            const token = localStorage.getItem("token");
            const req = await axios.delete(`http://localhost:8080/api/itens/${itemId}/permanente`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            Swal.fire({
                title: 'O item foi excluido',
                text: 'O item foi excluido com sucesso!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(0);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchItemAndOpenModal(itemId) {
        try {
            const token = localStorage.getItem("token");
            // CORRIGIDO: removido formData da requisição GET
            const response = await axios.get(
                `http://localhost:8080/api/itens/${itemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const item = response.data;
            console.log("Item carregado:", item);

            // Preencher os campos do modal
            setEditingItem(item);
            setFormData({
                title: item.nome || "",
                description: item.descricao || "",
                category: item.categoria || "",
                address: item.endereco || "",
            });
            setImagensBase64(item.imagens || []);

            setShowEditDialog(true);

        } catch (error) {
            console.error("Erro ao buscar item:", error);
            Swal.fire("Erro", "Não foi possível carregar o item.", "error");
        }
    }

    async function saveItemChanges() {
        try {
            const token = localStorage.getItem("token");

            const body = {
                nome: formData.title,
                descricao: formData.description,
                endereco: formData.address,
                imagens: imagensBase64,
                categoria: formData.category,
                proprietario: {
                    id: editingItem.proprietario.id
                }
            };


            console.log("Enviando atualização:", body);

            await axios.put(
                `http://localhost:8080/api/itens/${editingItem.id}`,
                body,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShowEditDialog(false);
            Swal.fire("Sucesso", "Item atualizado com sucesso!", "success").then(() => {
                navigate(0);
            });

        } catch (error) {
            console.log("Erro ao salvar:", error);
            Swal.fire("Erro", "Não foi possível atualizar o item.", "error");
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'FINALIZADA':
                return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Concluída</Badge>;
            case 'REJEITADA':
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelada</Badge>;
            default:
                return null;
        }
    };

    // renderização de cards de edição
    const renderEditSection = (negotiation) => (
        <Card className="mb-4 visible-desktop" key={`edit-${negotiation.id}`}>
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
                        </div>
                    </div>

                    <div className='y'>
                        {getStatusBadge(negotiation.status)}

                        {negotiation.status === 'PENDENTE' && (
                            <div className="flex gap-2 flex-col pt-4">
                                <div className='gap-2 flex'>
                                    {/* BOTÃO DE EDITAR */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className='w-full'
                                        onClick={() => fetchItemAndOpenModal(negotiation.item.id)}
                                    >
                                        <Pencil />
                                        Editar
                                    </Button>
                                </div>
                                <div className='gap-2 flex'>
                                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size='sm' className='w-full'>
                                                <Trash2 />
                                                Excluir Item
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className='margin0'>
                                                    Excluir item
                                                </DialogTitle>
                                                <DialogDescription className='margin0 mb-2'>
                                                    Você tem certeza que quer excluir o item?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={() => deleteItem(negotiation.item.id)}>Confirmar</Button>
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
    )

    const renderConfirmExchange = (negotiation) => (
        <Card className="mb-4 visible-desktop" key={`confirm-${negotiation.id}`}>
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
                                    <AvatarFallback>
                                        {negotiation.comprador?.nome
                                            ? negotiation.comprador.nome[0]
                                            : ""}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                    {negotiation.comprador?.nome || "Sem comprador"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='y'>
                        {getStatusBadge(negotiation.status)}

                        {negotiation.status === 'PENDENTE' && (
                            <div className="flex gap-2 flex-col pt-4">
                                <div className='gap-2 flex'>
                                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex-1">
                                                <CircleOff />
                                                Cancelar
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className='margin0'>Cancelar Solicitação</DialogTitle>
                                                <DialogDescription className='margin0 mb-2'>
                                                    Você tem certeza vai cancelar a solicitação do usuario de que o item foi trocado?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                                                    Não
                                                </Button>
                                                <Button onClick={() => cancelNegotiation(negotiation.id)}>Confirmar</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div>
                                    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex-1">
                                                <CheckCircle2 />
                                                Confirmar
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
                                                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
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
    )

    const pendente = response.filter(n => n.status === "PENDENTE");
    const semComprador = pendente.filter(neg => neg.comprador === null);
    const comComprador = pendente.filter(neg => neg.comprador !== null)
    const finalizada = response.filter(n => n.status === "FINALIZADA");
    const rejeitada = response.filter(n => n.status === "REJEITADA");

    return (
        <div className='body-reviewScreen'>
            <header>
                <Navbar2 />
            </header>
            <main className="main-reviewScreen">
                <div className='center'>
                    {/* MODAL DE EDIÇÃO - FORA DO LOOP */}
                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Editar Item</DialogTitle>
                                <DialogDescription>Atualize as informações do item.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium">Nome</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Descrição</label>
                                    <textarea
                                        className="w-full border p-2 rounded"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Endereço</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, address: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Imagens</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="w-full border p-2 rounded"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                {imagensBase64.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {imagensBase64.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Preview ${index + 1}`}
                                                className="preview-imagem-item"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={saveItemChanges}>Salvar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

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
                            <h2 className="text-xl font-semibold mb-4">Sessão de edição de anúncio</h2>
                            {semComprador.length > 0 ? (
                                semComprador.map(renderEditSection)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Nenhuma negociação em andamento sem comprador
                                    </CardContent>
                                </Card>
                            )}

                            <br />
                            <h2 className="text-xl font-semibold mb-4">Sessão de Confirmação da troca do item</h2>
                            {comComprador.length > 0 ? (
                                comComprador.map(renderConfirmExchange)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Nenhuma negociação aguardando confirmação
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="completed">
                            {finalizada.length > 0 ? (
                                finalizada.map(renderConfirmExchange)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Nenhuma negociação concluída
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="cancelled">
                            {rejeitada.length > 0 ? (
                                rejeitada.map(renderConfirmExchange)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Nenhuma negociação cancelada
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