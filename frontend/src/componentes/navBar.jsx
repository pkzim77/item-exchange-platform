import '../css/navBar.css'
import logo from '../assets/iconLogo.png'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from './avatar';
import { useUser } from '../contexts/UserContext';

function Navbar() {

  const { user } = useUser();
  
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
          <a href="#" className="nav-link">Chat</a>
        </div>

        {/* Links de navegação a direita */}
        {user?
          (<div className="navbar-links-right">
            <Avatar className="height-6 width-6">
              <AvatarFallback>{user.email[0]}</AvatarFallback>
            </Avatar>
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