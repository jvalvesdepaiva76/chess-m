"use client"; 

import React, { useEffect } from 'react';

export default function ChessBoard() {
  useEffect(() => {
    if (typeof window !== "undefined") {
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
        const board = window.Chessboard("board1", {
          draggable: true, // Permitir arrastar as peças
          position: "start",
          pieceTheme: '/chessboardjs/img/chesspieces/wikipedia/{piece}.png'
        });

        // Configuração dos botões
        document.getElementById("startBtn").addEventListener("click", () => board.start());
        document.getElementById("clearBtn").addEventListener("click", () => board.clear());
      };
    }
  }, []);

  return (
    <div>
      <div id="board1" style={{ width: "450px" }}></div>
      <button id="startBtn">Posição Inicial</button>
      <button id="clearBtn">Limpar Tabuleiro</button>
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css" 
        integrity="sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU" 
        crossOrigin="anonymous" 
      />
    </div>
  );
}
