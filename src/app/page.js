import ChessBoard from './components/ChessBoard';

export default function Home() {
  return (
    <main className="main-container">
      <header className="header">
        <h1 className="header-title">Chess Master</h1>
        <p className="header-description">Seu analisador de partidas de xadrez</p>
      </header>

      <ChessBoard />

      <section className="future-features">
        <ul>
          <li>Modo Análise - Visualize análises avançadas de partidas</li>
          <li>Histórico de Partidas - Salve e compartilhe suas partidas favoritas</li>
          <li>Jogos Multiplayer - Jogue com amigos</li>
        </ul>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Chess Master. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
