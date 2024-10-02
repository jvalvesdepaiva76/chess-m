"use client";

import ChessBoard from './components/ChessBoard';
import DailyPuzzle from './components/DailyPuzzle';

export default function Home() {
  return (
    <main className="main-container">
      <header className="header">
        <h1 className="header-title">Chess Master</h1>
        <p className="header-description">Seu analisador de partidas de xadrez</p>
      </header>

      <ChessBoard />

      {/* Seção do Desafio Diário */}
      <section className="daily-puzzle-section">
        <h2>Desafio Diário de Xadrez</h2>
        <DailyPuzzle />
      </section>

      <footer className="footer">
        <p>&copy; 2024 Chess Master. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
