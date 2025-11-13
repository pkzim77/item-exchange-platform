import { Navbar2 } from '../componentes/navBar2';
import '../css/createAdvertisementScreen.css'
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../componentes/card';
import { Button } from '../componentes/button';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Input } from "../componentes/input";
import { TextArea } from '../componentes/textArea'

export default function CreateAdvertisementScreen() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        address: '',
    });
    const [images, setImages] = useState([])

    const handleCancel = () => {
        navigate('/');
    };

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const newImage = URL.createObjectURL(e.target.files[0]);
            setImages([...images, newImage]);
        }
    };

    const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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
                            <form action="" className='form-createAdvertisementScreen'>
                                <div className='space-y-2'>
                                    <label htmlFor="">Fotos do item</label>
                                    <div className='photo-upload-grid'>
                                        {images.map((image, index) => (
                                            <div key={index} className='relative'>
                                                <img
                                                    src={image}
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
                                    <select name="" id="" onChange={(e) => option(e.target.value)} className='select-createAdvertisementScreen'>
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