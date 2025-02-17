import { useEffect, useState } from "react";
import "./index.css";
import GameBoard from "./GameBoard.jsx";
import Controls from "./Controls.jsx";
import Score from "./Score.jsx"

const symbols = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍓", "🥝", "🍑"];
const flipSound = new Audio('flip.mp3');
const congratsSound = new Audio('congrats.mp3');
const matchSound = new Audio('success.mp3');

let permitted = true;

export default function App() {

    //loading saved state if exists
    function getSavedGameState() {
        let savedState = sessionStorage.getItem("memoryGameState");
        if (savedState) {
            return JSON.parse(savedState)
        }
        return null;
    }

    const savedState = getSavedGameState();

    const [cards, setCards] = useState(savedState? savedState.cards :
        [...symbols, ...symbols].sort(() => Math.random() - 0.5).map((symbol, index) => {
                        return {
                            id: index,
                            symbol,
                            flipped: false,
                            matched: false
                        }
                    })
    )

    const [flippedCards, setFlippedCards] = useState(savedState? savedState.flippedCards : []);

    const [moves, setMoves] = useState(savedState? savedState.moves : 0);

    const [matched, setMatched] = useState(savedState? savedState.matched :0);

    const handleCardClick = function(id) {
        
        if (!permitted) {
            return
        }

        //plays flip sound when a card is flipped
        flipSound.currentTime = 0; // Ensure sound plays fully each time
        flipSound.play();

        let newFlipped = [...flippedCards, id];

        setCards((prevCards) => {
            return prevCards.map((card) => {
                return card.id === id ? {...card, flipped: true } : card;
            })
        })

        if (newFlipped.length === 2) {

            let [first, second] = newFlipped;

            if (cards[first].symbol === cards[second].symbol) {
                setCards((prevCards) => {
                    return prevCards.map((card) => {
                        return newFlipped.includes(card.id) ? {...card, matched: true } : card;
                })})
                setMatched((prev) => prev + 1);
                matchSound.currentTime = 0; // ensures sound plays fully each time
                matchSound.play()           
            } else {
                permitted = false;
                setTimeout(() => {
                    setCards((prevCards) => {
                        return prevCards.map((card) => {
                            return newFlipped.includes(card.id) ? {...card, flipped: false } : card;
                        })
                    })
                    permitted = true;
                }, 1000);                
            }
            setMoves((prev) => prev + 1);
            setFlippedCards([]);
        } else {
            setFlippedCards(newFlipped);
        }
    }

    useEffect(() => {
        if (matched === symbols.length) {
            console.log("this should run when win");
            congratsSound.play();
            setTimeout(() => {
                alert("🎉 Good Job! You completed the game in " + moves + " moves.");
            },250)
        };
    }, [matched, moves]);

    const [selectedColor, setSelectedColor] = useState(savedState? savedState.selectedColor : "green");

    const handleChangeColor = function(event) {
        setSelectedColor(event.target.value);
    }

    const handleReset = function() {
        setCards([...symbols, ...symbols].sort(() => Math.random() - 0.5).map((symbol, index) => {
            return {
                id: index,
                symbol,
                flipped: false,
                matched: false
            }
        }))
        setFlippedCards([]);
        setMoves(0);
        setMatched(0);
    }

    // saving gameState for reload
    function saveGameState() {

        let gameState = {
          moves,
          matched,
          selectedColor,
          cards,
          flippedCards
        }
      
        sessionStorage.setItem('memoryGameState', JSON.stringify(gameState));
    }

    useEffect(saveGameState, [moves, matched, flippedCards, selectedColor, cards])

    return (
        <div className="container">
            <h1>Memory Game</h1>
            <p>Click on two cards to find a matching pair.</p>
            <Controls selectedColor={selectedColor} handleChangeColor={handleChangeColor} handleReset = {handleReset} />
            <GameBoard  cards={cards} color={selectedColor} handleCardClick={handleCardClick} />
            <div className="scores">
               <Score moves={moves} /> 
            </div>            
        </div>
    )
}

