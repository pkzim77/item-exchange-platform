import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../componentes/card';
import '../css/registerScreen.css'
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { Input } from "../componentes/input";
import { Navbar2 } from '../componentes/navBar2';
import { Button } from '../componentes/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import PasswordStrengthBar from "react-password-strength-bar";
import Swal from 'sweetalert2';

export default function RegisterScreen() {

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState({
        street: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    const handleCepChange = (e) => {
        const valor = formatCep(e.target.value);
        setCep(valor);
        searchCep(valor);
    };

    const formatCep = (valor) => {
        return valor
            .replace(/\D/g, '')          // remove tudo que não for número
            .replace(/(\d{5})(\d)/, '$1-$2') // adiciona o hífen depois do 5º número
            .slice(0, 9);                // limita a 9 caracteres
    };

    const searchCep = async (valueCep) => {
        const cleanCep = valueCep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            try {
                const res = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`)
                const data = res.data

                if (!data.erro) {
                    setAddress({
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    })
                } else {
                    alert('CEP não encontrado!');
                    setAddress({ street: '', neighborhood: '', city: '', state: '' });
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    }

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
        } else {
            value = value.replace(/^(\d*)/, "($1");
        }

        setPhone(value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
            title: 'As senhas não coincidem',
            text: 'Por favor, digite a mesma senha nos dois campos.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
            return;
        }

        console.log({
            password,
            confirmPassword,
            phone,
            cep,
            address,
        });


        Swal.fire({
            title: 'Cadastro realizado!',
            text: 'Seu cadastro foi realizado com sucesso.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };

    return (
        <div className='body-registerScreen'>
            <header>
                <Navbar2 />
            </header>
            <main className='main-registerScreen'>
                <Card className="card">
                    <CardHeader className="card-header2">
                        <CardTitle className="text-center margin0">Criar conta</CardTitle>
                        <CardDescription className="text-center">Preencha os dados abaixo para criar sua conta</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='space-y-2'>
                                <label htmlFor="name">Nome Completo</label>
                                <div className='relative'>
                                    <User className='icon-input' />
                                    <Input type="text" id='name' placeholder="Digite seu nome completo"
                                        className='pl-10' required />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="email">Email</label>
                                <div className='relative'>
                                    <Mail className='icon-input' />
                                    <Input type="email" id='email' placeholder="Digite seu email"
                                        className='pl-10' required />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="phone">Telefone</label>
                                <div className='relative'>
                                    <Phone className='icon-input' />
                                    <Input
                                        type="tel"
                                        id='phone'
                                        placeholder="(00) 00000-0000"
                                        className='pl-10'
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="cep">Cep</label>
                                <div className='relative'>
                                    <MapPin className='icon-input' />
                                    <Input
                                        type="text" id='cep'
                                        placeholder="00000-000"
                                        className='pl-10'
                                        maxLength="9"
                                        onChange={handleCepChange}
                                        value={cep}
                                        required />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="address">logradouro</label>
                                <div className='relative'>
                                    <MapPin className='icon-input' />
                                    <Input
                                        type="text"
                                        id='address'
                                        placeholder="Nome do logradouro"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        className='pl-10'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="neighborhood">Bairro</label>
                                <div className='relative'>
                                    <MapPin className='icon-input' />
                                    <Input
                                        type="text"
                                        id="neighborhood"
                                        placeholder="Nome do bairro"
                                        value={address.neighborhood}
                                        onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                                        className='pl-10'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="city">Cidade</label>
                                <div className='relative'>
                                    <MapPin className='icon-input' />
                                    <Input
                                        type="text"
                                        id="city"
                                        placeholder="Nome da cidade"
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        className='pl-10'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="state">Estado</label>
                                <div className='relative'>
                                    <MapPin className='icon-input' />
                                    <Input
                                        type="text"
                                        id="state"
                                        placeholder="UF"
                                        value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                        className='pl-10'
                                        maxLength="2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="password">Senha</label>
                                <div className='relative'>
                                    <Lock className='icon-input' />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Digite sua senha"
                                        className="input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="toggle-password"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>

                                    <PasswordStrengthBar
                                        password={password}
                                        shortScoreWord="Muito curta"
                                        scoreWords={["Fraca", "Razoável", "Boa", "Forte", "Excelente"]}
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="confirmPassword">Confirmar Senha</label>
                                <div className='relative'>
                                    <Lock className='icon-input' />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="Confirme sua senha"
                                        className='pl-10'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="toggle-password"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" >Cadastrar</Button>

                        </form>
                    </CardContent>
                    <CardFooter className='card-footer2'>
                        <div>
                            Já tem uma conta?{''}
                            <Link to='/login'><Button variant="link" className="px-1">Fazer login</Button></Link>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}