"use client";

// src/components/DailyPuzzle.js

import React, { useEffect, useState } from 'react';

export default function DailyPuzzle() {
  const [puzzleData, setPuzzleData] = useState(null);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch('https://chesspuzzle.net/Daily/Api');
        if (response.ok) {
          const result = await response.json();
          setPuzzleData(result);
        }
      } catch (error) {
        console.error('Erro ao buscar o desafio diário:', error);
      }
    };

    fetchPuzzle();
  }, []);

  if (!puzzleData) {
    return <div>Carregando desafio diário...</div>;
  }

  return (
    <div>
      <a href={puzzleData.Link} id="puzzleLink" target="_blank" rel="noopener noreferrer">
        <img id="puzzleImage" src={puzzleData.Image} alt="Daily Chess Puzzle" />
      </a>
      <h3><span id="puzzleText">{puzzleData.Text}</span></h3>
    </div>
  );
}
