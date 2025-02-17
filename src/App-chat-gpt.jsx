import {useRef} from "react";
import "./index.css";
import Card from "./Card.jsx";
import Control from "./Controls.jsx";
import GameBord from "./GameBoard.jsx"


const symbols = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍓", "🥝", "🍑"];

export default function App() {
  const deckRef = useRef(shuffleArray(symbols));
  const flippedCardsRef = useRef([]);
  const matchedPairsRef = useRef(0);
  const movesRef = useRef(0);
  const boardRef = useRef(null);
  const scoreRef = useRef(null);

  const handleCardClick = (event) => {
    const clickedCard = event.target;
    const index = clickedCard.dataset.index;
    if (flippedCardsRef.current.length === 2 || clickedCard.textContent) return;

    clickedCard.textContent = deckRef.current[index];
    flippedCardsRef.current.push(clickedCard);

    if (flippedCardsRef.current.length === 2) {
      movesRef.current++;
      scoreRef.current.textContent = `Moves: ${movesRef.current}`;

      const [first, second] = flippedCardsRef.current;
      if (first.textContent === second.textContent) {
        matchedPairsRef.current++;
        flippedCardsRef.current = [];
      } else {
        setTimeout(() => {
          first.textContent = "";
          second.textContent = "";
          flippedCardsRef.current = [];
        }, 700);
      }
    }
  };

  const restartGame = () => {
    deckRef.current = shuffleArray(symbols);
    matchedPairsRef.current = 0;
    movesRef.current = 0;
    scoreRef.current.textContent = "Moves: 0";

    boardRef.current.childNodes.forEach((card) => {
      card.textContent = "";
    });
  };

  return (
    <div className="container">
      <h1>Memory Game</h1>
      <p>Click on two cards to find a matching pair.</p>
      <div ref={scoreRef} className="scores">
        Moves: 0
      </div>
      <GameBoard deck={deckRef.current} handleCardClick={handleCardClick} />
      <Controls restartGame={restartGame} />
    </div>
  );
};


const shuffleArray = (array) => {
  let deck = array.concat(array);

  for (let i = 0; i < deck.length; i++) {
    let randomIndex1 = Math.floor(deck.length * Math.random());
    let randomIndex2 = Math.floor(deck.length * Math.random());

    let temp = deck[randomIndex1];
    deck[randomIndex1] = deck[randomIndex2];
    deck[randomIndex2] = temp;

    return deck;
  }
};

const Card = ({ symbol, index, onClick }) => {
  return <div className="card" data-index={index} onClick={onClick}></div>;
};

const GameBoard = ({ deck, handleCardClick }) => {
  return (
    <div className="game-board">
      {deck.map((symbol, index) => (
        <Card key={index} symbol={symbol} index={index} onClick={handleCardClick} />
      ))}
    </div>
  );
};

const Controls = ({ restartGame }) => {
  return (
    <div id="controls">
      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
}