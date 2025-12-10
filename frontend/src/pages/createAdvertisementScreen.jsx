import { Navbar2 } from '../componentes/navBar2';
import '../css/createAdvertisementScreen.css';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../componentes/card';
import { Button } from '../componentes/button';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Input } from "../componentes/input";
import { TextArea } from '../componentes/textArea';
import Swal from 'sweetalert2';

export default function CreateAdvertisementScreen() {

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        address: '',
    });
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false);

    // Cleanup das URLs de preview para evitar memory leaks
    useEffect(() => {
        return () => {
            images.forEach(img => {
                if (img.preview) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, [images]);

    const handleCancel = () => {
        // Limpar as URLs de preview antes de cancelar
        images.forEach(img => {
            if (img.preview) {
                URL.revokeObjectURL(img.preview);
            }
        });
        navigate('/');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    title: 'Apenas imagens são permitidas',
                    text: 'Por favor, selecione arquivos nos formatos JPG, PNG ou GIF.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Validar tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    title: 'Arquivo muito grande',
                    text: 'A imagem deve ter no máximo 5MB.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }

            file.preview = URL.createObjectURL(file);
            setImages([...images, file]);
        }
    };

    const removeImage = (index) => {
        const imageToRemove = images[index];
        if (imageToRemove.preview) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setImages(images.filter((_, i) => i !== index));
    };

    // Função para converter imagem para Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            Swal.fire({
                    title: 'Por favor, adicione pelo menos uma imagem do item!',
                    text: 'Para criar um anuncio é preciso adicionar pelo menos uma imagem.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            return;
        }
        if (!formData.category) {
            Swal.fire({
                    title: 'Por favor, selecione uma categoria!',
                    text: 'Para criar um anuncio é preciso escolher uma categoria.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            return;
        }

        setLoading(true);

       try {
    const token = localStorage.getItem("token");

    // Converter todas as imagens para Base64
    const imagensBase64 = await Promise.all(
      images.map(img => convertToBase64(img))
    );

    const body = {
      nome: formData.title,
      descricao: formData.description,
      categoria: formData.category,
      imagens: imagensBase64,
      endereco: formData.address,
      proprietario: {"id": user.id}
      
    };

    console.log("JSON enviado:", body);

    await axios.post("http://localhost:8080/api/itens", body, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    await axios.post()

    Swal.fire({
                    title: 'Anuncio Criado!',
                    text: 'Você criou o anuncio com sucesso.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
    setFormData({ title: '', category: '', description: '', address: '' });
    setImages([]);
    navigate('/');
  } catch (error) {
    console.error(error);
     Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao criar o anuncio.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
  } finally {
    setLoading(false);
  }
};
    return (
        <div className='body-createAdvertisementScreen'>
            <header>
                <Navbar2 />
            </header>
            <main className='main-createAdvertisementScreen'>
                <div className='center'>
                    <Card className='card-createAdvertisementScreen'>
                        <CardHeader className='cardHeader-createAdvertisementScreen'>
                            <CardTitle>Informações do anúncio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className='form-createAdvertisementScreen'>
                                <div className='space-y-2'>
                                    <label htmlFor="">Fotos do item</label>
                                    <div className='photo-upload-grid'>
                                        {images.map((image, index) => (
                                            <div key={index} className='relative'>
                                                <img
                                                    src={image.preview}
                                                    alt={`Upload ${index + 1}`}
                                                    className='item-preview'
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="remove-photo-btn"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        ))}
                                        {images.length < 6 && (
                                            <label className="upload-area">
                                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-600">Adicionar foto</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    required
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="title">Título do Anúncio</label>
                                    <Input
                                        id="title"
                                        placeholder="Ex: Bicicleta Mountain Bike"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className='pl-8'
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="category">Categoria</label>
                                    <select onChange={(e) => setFormData({ ...formData, category: e.target.value })} className='select-createAdvertisementScreen'>
                                        <option value='' >Todas</option>
                                        <option value="Esportes">Esportes</option>
                                        <option value="Livros">Livros</option>
                                        <option value="Eletrônicos">Eletrônicos</option>
                                        <option value="Móveis">Movéis</option>
                                        <option value="Instrumentos">Instrumentos</option>
                                        <option value="Roupas">Roupas</option>

                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description">Descrição</label>
                                    <TextArea
                                        id="description"
                                        placeholder="Descreva o item que você quer trocar..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={5}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="address">Endereço</label>
                                    <Input
                                        id="address"
                                        placeholder="Cidade, Estado"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                        className='pl-8'
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleCancel}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Publicar Anúncio
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>



    )
}