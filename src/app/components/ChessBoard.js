"use client";

import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js'; // Importa a biblioteca chess.js
import { getAberturas, getChequeMates } from '../services/chessService'; // Importa os serviços do Supabase

export default function ChessBoard() {
  const [chess, setChess] = useState(null); // Estado para o objeto chess.js
  const [moves, setMoves] = useState([]);   // Lista de movimentos extraídos do PGN
  const [currentMove, setCurrentMove] = useState(0); // Controle do lance atual
  const [board, setBoard] = useState(null); // Tabuleiro de xadrez
  const [status, setStatus] = useState(""); // Status do jogo
  const [gameMode, setGameMode] = useState("multiplayer"); // Alternar entre multiplayer e análise
  const [aberturas, setAberturas] = useState([]); // Estado para armazenar as aberturas do Supabase
  const [chequeMates, setChequeMates] = useState([]); // Estado para armazenar os chequemates do Supabase

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
          draggable: gameMode === "multiplayer", // Permitir arrastar peças apenas no modo multiplayer
          position: "start",
          pieceTheme: '/chessboardjs/img/chesspieces/wikipedia/{piece}.png',
          onDragStart: (source, piece, position, orientation) => {
            if (gameMode === "analysis") return false; // Bloqueia arrastar no modo análise

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
            if (gameMode === "analysis") return "snapback"; // Bloqueia lances no modo análise

            // Verifica se a origem e o destino são diferentes
            if (source === target) {
              return "snapback"; // Se forem iguais, desfaz o movimento
            }

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
        
        // Configuração dos botões de orientação
        document.getElementById("flipOrientationBtn").addEventListener("click", () => {
          boardInstance.flip(); // Inverte a orientação
        });

        // Buscar as aberturas e chequemates do Supabase
        const fetchChessData = async () => {
          try {
            const aberturasData = await getAberturas();
            const chequeMatesData = await getChequeMates();

            // Logs para verificar os dados recebidos do Supabase
            console.log("Aberturas recebidas:", aberturasData);
            console.log("Cheque mates recebidos:", chequeMatesData);

            if (aberturasData.length > 0) {
              setAberturas(aberturasData); // Atualiza o estado de aberturas
            } else {
              console.warn("Nenhuma abertura encontrada na tabela.");
            }

            if (chequeMatesData.length > 0) {
              setChequeMates(chequeMatesData); // Atualiza o estado de cheque mates
            } else {
              console.warn("Nenhum cheque mate encontrado na tabela.");
            }

          } catch (error) {
            console.error("Erro ao buscar dados do Supabase:", error);
          }
        };

        fetchChessData(); // Chama a função para buscar os dados
      };
    }
  }, [gameMode]); // Recarregar o tabuleiro ao mudar o modo

  // Função que verifica se o arquivo é .pgn usando RegExp
  const isValidPGN = (filename) => {
    const pgnRegex = /\.pgn$/i; // Expressão regular que verifica a extensão .pgn
    return pgnRegex.test(filename);
  };

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

  // Carregar PGN no Modo Análise
  const handlePGNUpload = (event) => {
    const file = event.target.files[0];

    // Validação de arquivo usando RegExp
    if (!isValidPGN(file.name)) {
      alert("Por favor, selecione um arquivo .pgn válido!"); // Alerta em caso de arquivo inválido
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const pgn = e.target.result;
      const success = chess.load_pgn(pgn);

      if (!success) {
        alert("Erro ao carregar o PGN!"); // Alerta em caso de erro no carregamento do PGN
        return;
      }

      const history = chess.history({ verbose: true });
      setMoves(history);
      setCurrentMove(0); // Começar do início
      board.position("start"); // Reseta o tabuleiro
    };
    reader.readAsText(file);
  };

  // Avançar para o próximo lance do PGN
  const nextMove = () => {
    if (currentMove < moves.length) {
      const move = moves[currentMove];
      chess.move(move.san);
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

  // Função para definir uma posição específica via FEN
  const goToFENPosition = (fen) => {
    board.position(fen); // Define a posição usando a string FEN
  };

  return (
    <div>
      <h1>{gameMode === "multiplayer" ? "Multiplayer" : "Modo Análise"}</h1>

      {/* Seletor de modo */}
      <div>
        <button onClick={() => setGameMode("multiplayer")}>Multiplayer</button>
        <button onClick={() => setGameMode("analysis")}>Modo Análise</button>
      </div>

      {gameMode === "analysis" && (
        <>
          {/* Input para carregar o arquivo PGN */}
          <input type="file" onChange={handlePGNUpload} accept=".pgn" />

          {/* Botões de navegação do PGN */}
          <div className="button-container">
            <button onClick={prevMove}>Lance Anterior</button>
            <button onClick={nextMove}>Próximo Lance</button>
          </div>

          {/* Exibir Aberturas e Cheque Mates dinâmicos */}
          <div className="opening-section">
            <h3>Aberturas do Supabase</h3>
            {aberturas.length === 0 ? (
              <p>Carregando aberturas...</p>
            ) : (
              aberturas.map((abertura) => (
                <button key={abertura.id} onClick={() => goToFENPosition(abertura.position)}>
                  {abertura.name}
                </button>
              ))
            )}
          </div>

          <div className="chequemate-section">
            <h3>Cheque Mates do Supabase</h3>
            {chequeMates.length === 0 ? (
              <p>Carregando cheque mates...</p>
            ) : (
              chequeMates.map((mate) => (
                <button key={mate.id} onClick={() => goToFENPosition(mate.position)}>
                  {mate.name}
                </button>
              ))
            )}
          </div>
        </>
      )}

      {/* Tabuleiro */}
      <div id="board1" style={{ width: "450px" }}></div>

      {/* Botões de controle da orientação */}
      <div className="orientation-controls">
        <button id="flipOrientationBtn">Inverter Orientação</button>
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
