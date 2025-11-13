import '../css/navBar.css'
import logo from '../assets/iconLogo.png'
import {Link} from 'react-router-dom';

function Navbar(){
    return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src= {logo} alt="trocafácil" />
          <h1>TrocaFácil</h1>
        </div>

        {/* Links de navegação central */}
        <div className="navbar-links-center">
          <a href="#" className="nav-link">Negociações</a>
          <Link className='nav-link' to="/createAdvertisement">Criar um anuncio</Link>
          <a href="#" className="nav-link">Chat</a>
        </div>

        {/* Links de navegação a direita */}
        <div className="navbar-links-right">
          <Link to="/register" className="nav-link">Registre-se</Link>
          <Link to="/login" className="nav-link">Faça Login</Link>
        </div>

      </div>
    </nav>
  );
}
export {Navbar}