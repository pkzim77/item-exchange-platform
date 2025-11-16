import '../css/navBar2.css'
import logo from '../assets/iconLogo.png'
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Avatar, AvatarFallback } from './avatar';

function Navbar2() {

    const { user } = useUser();
    return (
        <nav className="navbar2">
            <div className="navbar-container2">
                <Link to="/" className="nav-link2">
                    {/* Logo */}
                    <div className="navbar-logo2">
                        <img src={logo} alt="trocafácil" />
                        <h1>TrocaFácil</h1>
                    </div>
                </Link>
                {/* Links de navegação a direita */}
                {user ?
                    (<div className="navbar-links-right2">
                        <Link to="/" className="nav-link2"><X /></Link>
                        <Avatar className="height-6 width-6">
                            <AvatarFallback>{user.email[0]}</AvatarFallback>
                        </Avatar>
                    </div>) :
                    (<div className="navbar-links-right2">
                        <Link to="/" className="nav-link2"><X /></Link>
                    </div>)
                }


            </div>
        </nav>
    );
}
export { Navbar2 }