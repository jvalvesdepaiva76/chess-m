"use client";

import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js'; // Importa a biblioteca chess.js

export default function ChessBoard() {
  const [chess, setChess] = useState(null); // Estado para o objeto chess.js
  const [moves, setMoves] = useState([]);   // Lista de movimentos extraídos do PGN
  const [currentMove, setCurrentMove] = useState(0); // Controle do lance atual
  const [board, setBoard] = useState(null); // Tabuleiro de xadrez
  const [status, setStatus] = useState(""); // Status do jogo

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Carregar jQuery e chessboard.js via CDN
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://code.jquery.com/jquery-3.5.1.min.js";
      jqueryScript.integrity = "sha384-ZvpUoO/+PpLXR1lu4jmpXWu80pZlYUAfxl5NsBMWOEPSjUn/6Z/hRTt8+pR6L4N2";
      jqueryScript.crossOrigin = "anonymous";
      document.head.appendChild(jqueryScript);

      const chessboardScript = document.createElement("script");
      chessboardScript.src = "https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js";
      chessboardScript.integrity = "sha384-8Vi8VHwn3vjQ9eUHUxex3JSN/NFqUg3QbPyX8kWyb93+8AC/pPWTzj+nHtbC5bxD";
      chessboardScript.crossOrigin = "anonymous";
      document.head.appendChild(chessboardScript);

      chessboardScript.onload = () => {
        const chessInstance = new Chess(); // Inicializa a instância chess.js
        setChess(chessInstance); // Salva a instância no estado

        const boardInstance = window.Chessboard("board1", {
          draggable: true, // Permitir arrastar peças
          position: "start",
          pieceTheme: '/chessboardjs/img/chesspieces/wikipedia/{piece}.png',
          onDragStart: (source, piece, position, orientation) => {
            // Não permitir pegar peças após o fim do jogo
            if (chessInstance.isGameOver()) return false;

            // Só permitir que o jogador da vez mova as peças
            if (
              (chessInstance.turn() === "w" && piece.search(/^b/) !== -1) ||
              (chessInstance.turn() === "b" && piece.search(/^w/) !== -1)
            ) {
              return false;
            }
          },
          onDrop: (source, target) => {
            // Tenta fazer o movimento
            const move = chessInstance.move({
              from: source,
              to: target,
              promotion: "q", // Promoção automática para rainha
            });

            // Movimento ilegal
            if (move === null) return "snapback";

            // Atualiza a posição do tabuleiro
            boardInstance.position(chessInstance.fen());
            updateStatus();
          },
          onSnapEnd: () => {
            boardInstance.position(chessInstance.fen());
          },
        });

        setBoard(boardInstance); // Salva o tabuleiro no estado
        updateStatus(); // Atualiza o status do jogo
      };
    }
  }, []);

  // Atualiza o status do jogo
  const updateStatus = () => {
    if (!chess) return; // Garante que chess está inicializado

    let status = "";
    let moveColor = "Branco";

    if (chess.turn() === "b") {
      moveColor = "Preto";
    }

    // Cheque-mate?
    if (chess.inCheckmate()) {
      status = "Fim de jogo, " + moveColor + " está em xeque-mate.";
    }

    // Empate?
    else if (chess.inDraw()) {
      status = "Fim de jogo, empate por posição.";
    }

    // Jogo continua
    else {
      status = moveColor + " para jogar.";

      // Cheque?
      if (chess.inCheck()) {
        status += " " + moveColor + " está em xeque.";
      }
    }

    setStatus(status);
  };

  // Avançar para o próximo lance do PGN
  const nextMove = () => {
    if (currentMove < moves.length) {
      const move = moves[currentMove];
      chess.move(move);
      board.position(chess.fen()); // Atualiza o tabuleiro
      setCurrentMove(currentMove + 1); // Avança para o próximo movimento
      updateStatus();
    }
  };

  // Voltar para o lance anterior
  const prevMove = () => {
    if (currentMove > 0) {
      chess.undo(); // Desfaz o último lance
      board.position(chess.fen()); // Atualiza o tabuleiro
      setCurrentMove(currentMove - 1); // Retrocede um lance
      updateStatus();
    }
  };

  // Carrega o arquivo PGN
  const handlePGNUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const pgn = e.target.result;
      chess.loadPgn(pgn); // Carrega o arquivo PGN no objeto chess.js
      const history = chess.history({ verbose: true }); // Extrai a lista de movimentos
      setMoves(history);
    };
    reader.readAsText(file);
  };

  // Detectar teclas de seta para avançar/retroceder nos movimentos
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "ArrowRight") {
        nextMove(); // Avançar no PGN
      } else if (event.key === "ArrowLeft") {
        prevMove(); // Retroceder no PGN
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentMove, moves]);

  return (
    <div>
      <h1>Modo Análise</h1>

      {/* Input para carregar o arquivo PGN */}
      <input type="file" onChange={handlePGNUpload} accept=".pgn" />

      <div id="board1" style={{ width: "450px" }}></div>

      <div className="button-container">
        <button onClick={prevMove} className="green-button">Lance Anterior</button>
        <button onClick={nextMove} className="green-button">Próximo Lance</button>
      </div>

      {/* Exibe o status do jogo */}
      <div>
        <h3>Status:</h3>
        <p>{status}</p>
      </div>

      <link
        rel="stylesheet"
        href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css"
        integrity="sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU"
        crossOrigin="anonymous"
      />
    </div>
  );
}
