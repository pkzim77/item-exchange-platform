import '../css/navBar.css'
import logo from '../assets/iconLogo.png'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from './avatar';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

function Navbar() {

  const { user } = useUser();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    navigate(0);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="trocafácil" />
          <h1>TrocaFácil</h1>
        </div>

        {/* Links de navegação central */}
        <div className="navbar-links-center">
          <Link className='nav-link' to="/negotiations">Negociações</Link>
          <Link className='nav-link' to="/createAdvertisement">Criar um anuncio</Link>
        </div>

        {/* Links de navegação a direita */}
        {user ?
          (<div className="navbar-links-right" onClick={toggleMenu}>
            <Avatar className="height-6 width-6 z-index1">
              <AvatarFallback>{user.email[0]}</AvatarFallback>
            </Avatar>

            {/* O Menu Dropdown que aparece condicionalmente */}
            {isMenuOpen && (
              <div className="dropdown-menu-navbar">
                {/* O botão "Sair" que chama a função logout */}
                <button onClick={logout} className="dropdown-item-logout">
                  Sair
                </button>
              </div>
            )}
          </div>) :
          (<div className="navbar-links-right">
            <Link to="/register" className="nav-link">Registre-se</Link>
            <Link to="/login" className="nav-link">Faça Login</Link>
          </div>)

        }


      </div>
    </nav>
  );
}
export { Navbar }