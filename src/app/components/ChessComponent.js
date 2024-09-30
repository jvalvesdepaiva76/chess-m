import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { getChequeMates, getAberturas } from '../services/chessService'; // Funções que conectam com Supabase

const ChessComponent = () => {
  const [board, setBoard] = useState(null);  // Tabuleiro de xadrez
  const [chess] = useState(new Chess());     // Instância de chess.js
  const [chequeMates, setChequeMates] = useState([]);  // Dados de cheque mate do Supabase
  const [aberturas, setAberturas] = useState([]);      // Dados de aberturas do Supabase

  useEffect(() => {
    // Inicializar o tabuleiro de xadrez
    const chessboard = window.Chessboard('myBoard', {
      draggable: true,
      position: 'start',
      pieceTheme: '/chessboardjs/img/chesspieces/wikipedia/{piece}.png',
    });
    setBoard(chessboard);

    // Buscar cheque mates e aberturas do Supabase
    const fetchData = async () => {
      const chequeMatesData = await getChequeMates();
      const aberturasData = await getAberturas();
      setChequeMates(chequeMatesData);  // Atualizar estado com cheque mates
      setAberturas(aberturasData);      // Atualizar estado com aberturas
    };

    fetchData();  // Executa a busca dos dados ao montar o componente
  }, []);

  // Função para definir a posição de uma abertura no tabuleiro
  const setAberturaPosition = (position) => {
    chess.load(position);  // Atualiza a posição no chess.js
    board.position(position);  // Atualiza a posição no chessboard.js
  };

  // Função para definir a posição de um cheque mate no tabuleiro
  const setChequeMatePosition = (position) => {
    chess.load(position);  // Atualiza a posição no chess.js
    board.position(position);  // Atualiza a posição no chessboard.js
  };

  return (
    <div>
      <div id="myBoard" style={{ width: 400 }}></div> {/* Tabuleiro de xadrez */}

      <div>
        <h3>Aberturas</h3>
        {aberturas.map((opening) => (
          <button key={opening.id} onClick={() => setAberturaPosition(opening.position)}>
            {opening.nome}  {/* Botão para carregar uma abertura */}
          </button>
        ))}
      </div>

      <div>
        <h3>Cheque Mates</h3>
        {chequeMates.map((mate) => (
          <button key={mate.id} onClick={() => setChequeMatePosition(mate.position)}>
            {mate.nome}  {/* Botão para carregar uma posição de cheque mate */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChessComponent;
