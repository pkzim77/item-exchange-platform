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
import { ArrowLeft, Star, MapPin, Phone, MessageSquare, Send, MoreVertical } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CommentSection } from '../componentes/commentSection';
import Swal from 'sweetalert2';

export default function ReviewScreen() {

    const user = JSON.parse(localStorage.getItem("user"));

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
    const [data4, setData4] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModalId, setOpenModalId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    let idNegotiation

    const [newComment, setNewComment] = useState('');

    const [comments, setComments] = useState([]);

    const handleAddComment = async () => {
        idNegotiation = getNegotiation(data4)

        if (!idNegotiation) {
            Swal.fire({
                title: 'Negociação não encontrada',
                text: 'Você precisa concluir a negociação do item antes de poder avaliá-lo.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            return;
        }
        if (newComment.trim()) {

            const token = localStorage.getItem("token");

            const payload = {
                nota: 5,
                comentario: newComment
            };

            try {
                const response = await axios.post(
                    `http://localhost:8080/api/avaliacoes/${idNegotiation}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setData2(prev => [response.data, ...prev]);
                setNewComment('');
            } catch (error) {
                console.error("Erro ao enviar avaliação:", error);
                alert(error.response?.data?.message || "Erro ao enviar comentário");
            }
        }
    };
    // Funções de ação
    const handleEditSubmit = async () => {
        if (!editText.trim()) return;

        try {
            const token = localStorage.getItem("token");

            const payload = {
                nota: 5,
                comentario: editText
            };

            const response = await axios.put(
                `http://localhost:8080/api/avaliacoes/${editingId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Atualiza no front sem reler API
            setData2(prev =>
                prev.map(r =>
                    r.id === editingId ? { ...r, comentario: editText, nota: 5 } : r
                )
            );

            // Fecha modal
            setEditingId(null);
            setEditText("");

            Swal.fire("Sucesso!", "Comentário atualizado.", "success");

        } catch (error) {
            console.error("Erro ao editar:", error);
            Swal.fire("Erro", error.response?.data?.message || "Erro ao atualizar.", "error");
        }
    };
    const handleDelete = (reviewId) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Esta ação não pode ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, deletar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("token");
                axios.delete(`http://localhost:8080/api/avaliacoes/${reviewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(() => {
                        console.log("Avaliação deletada com sucesso");
                        setData2(prev => prev.filter(r => r.id !== reviewId));

                    })
                    .catch((err) => {
                        console.error("Erro ao deletar avaliação:", err.response?.data?.message);
                    });
                Swal.fire("Deletado!", `Comentário removido.`, "success");
            }
        });
    };

    function getPercentage(count) {
        const total = Object.values(mockUserProfile.ratingBreakdown).reduce((acc, curr) => acc + curr, 0);
        if (total === 0) return 0;
        return (count / total) * 100;
    }
    function getNegotiation(negociacoes) {
        try {
            const negociacao = negociacoes.find(
                (negociacao) =>
                    negociacao.item.id === Number(id) &&
                    negociacao.comprador.id === user.id &&
                    negociacao.status === 'FINALIZADA'
            );
            if (!negociacao) {
                throw new Error('Negociação não encontrada');
            }
            return negociacao.id;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
    useEffect(() => {
        async function getItem() {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:8080/api/itens/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setData(response.data);
                console.log(response.data)

                const ownerId = response.data.proprietario.id;
                console.log(ownerId)

                const [secondResponse, thirdResponse, fourResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/avaliacoes/avaliado/${ownerId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),

                    axios.get(`http://localhost:8080/api/usuarios/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),

                    axios.get('http://localhost:8080/api/negociacoes/historico', {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);
                setData4(fourResponse.data)
                console.log(fourResponse.data);

                console.log(getNegotiation(fourResponse.data));

                console.log(getNegotiation(fourResponse.data));
                setData2(secondResponse.data);
                console.log(secondResponse.data)
                setData3(thirdResponse.data);
                console.log(thirdResponse.data)
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
                            <CardTitle>Comentarios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Campo de novo comentário */}
                                <div className="flex gap-3 mb-6">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{user.email[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Adicione um comentário..."
                                            className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
                                            rows={1}
                                            onFocus={(e) => {
                                                e.target.rows = 3;
                                            }}
                                            onBlur={(e) => {
                                                if (!newComment) e.target.rows = 1;
                                            }}
                                        />
                                        {newComment && (
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={() => setNewComment('')}
                                                    className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleAddComment}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    Comentar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Renderiza avaliações */}
                                {data2.map((review, index) => (
                                    <div key={review.id}>
                                        {index > 0 && <Separator className="mb-4" />}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{review.avaliadorNome[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{review.avaliadorNome}</span>
                                                </div>
                                                <div className="dropdown">
                                                    {[...Array(review.nota)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 star-text-yellow-500" />
                                                    ))}
                                                    <button
                                                        className="p-1 bg-transparent hover:bg-gray-100 rounded transition-colors"
                                                        onClick={() => setOpenModalId(openModalId === review.id ? null : review.id)}
                                                    >
                                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                    {openModalId === review.id && (
                                                        <div className="dropdown-menu">
                                                            {editingId !== review.id ? (
                                                                // Menu dropdown normal
                                                                <>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => {
                                                                            setEditingId(review.id);
                                                                            setEditText(review.comentario);
                                                                        }}
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => {
                                                                            handleDelete(review.id);
                                                                        }}
                                                                    >
                                                                        Deletar
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                // Modal de edição
                                                                <div className="dropdown-menu2">
                                                                    <div className="bg-white p-6 rounded-lg w-96 shadow">
                                                                        <h2 className="text-xl mb-3">Editar Comentário</h2>

                                                                        <textarea
                                                                            className="w-full border p-2 rounded mb-4"
                                                                            value={editText}
                                                                            onChange={e => setEditText(e.target.value)}
                                                                            rows="4"
                                                                        />

                                                                        <div className="flex justify-end gap-2">
                                                                            <button
                                                                                className="dropdown-item"
                                                                                onClick={() => {
                                                                                    setEditingId(null);
                                                                                    setEditText("");
                                                                                    setOpenModalId(null); // Fecha o dropdown também
                                                                                }}
                                                                            >
                                                                                Cancelar
                                                                            </button>

                                                                            <button
                                                                                className="dropdown-item"
                                                                                onClick={handleEditSubmit}
                                                                            >
                                                                                Salvar
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 margin0">{review.comentario}</p>
                                            <p className="text-xs text-gray-500 margin0">{review.data}</p>
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