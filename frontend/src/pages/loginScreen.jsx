import { Navbar2 } from '../componentes/navBar2';
import '../css/loginScreen.css'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../componentes/card';
import { Input } from "../componentes/input";
import { Button } from '../componentes/button';
import { useState, useEffect } from "react";
import { Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'
export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async(e) => {
        e.preventDefault();

        try {
            // Chama o backend
            const res = await axios.post("http://localhost:8080/api/auth/login", {
                email,  
                senha
                 //em portugue por conta  do backend
            });

            // Se login OK, recebe o token
            const { token } = res.data;
            console.log(token)

            // Salva o token no localStorage
            localStorage.setItem("token", token);

            // Redireciona para a página inicial
            onNavigate("/");

        } catch (error) {
            console.error("Erro no login:", error.response?.data || error.message);
            alert("Email ou senha inválidos");
        }
    };

    

return (
    <div className='body-loginScreen'>
        <header>
            <Navbar2 />
        </header>
        <main className='main-loginScreen'>
            <Card className='card-loginScreen'>
                <CardHeader className='cardHeader-loginScreen'>
                    <CardTitle className='text-center'>Bem-vindo de volta</CardTitle>
                    <CardDescription className='text-center'>Entre com suas credenciais para acessar sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className='space-y-2'>
                            <label htmlFor="email">Email</label>
                            <div className="relative">
                                <Mail className="icon-input" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Senha</label>
                            <div className="relative">
                                <Lock className="icon-input" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="link" className="px-0" type="button">
                                Esqueceu a senha?
                            </Button>
                        </div>
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="cardFooter-loginScreen">
                    <div className="text-center text-sm text-gray-600">
                        Não tem uma conta?{' '}
                        <Link to='/register'>
                            <Button
                                variant="link"
                                className="px-1"
                                onClick={() => onNavigate('register')}
                            >
                                Cadastre-se
                            </Button></Link>
                    </div>
                </CardFooter>
            </Card>
        </main>
    </div>



)
}