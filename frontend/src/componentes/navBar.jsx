import '../css/navBar.css'
import logo from '../assets/iconLogo.png'

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
          <a href="#" className="nav-link">Criar um anuncio</a>
          <a href="#" className="nav-link">Chat</a>
        </div>

        {/* Links de navegação a direita */}
        <div className="navbar-links-right">
          <a href="#" className="nav-link">Registre-se</a>
          <a href="#" className="nav-link">Faça Login</a>
        </div>

      </div>
    </nav>
  );
}
export {Navbar}