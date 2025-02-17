import Card from "./Card.jsx";



export default function GameBoard(props) {
    
    const cards = props.cards.map((card) => {
        return <Card 
                    key={card.id}
                    symbol={card.flipped ? card.symbol : ""}
                    flipped={card.flipped}
                    color={props.color}
                    onClick = {() => props.handleCardClick(card.id)} />
    })

    return (
        <div id="game-board">
            {cards}
        </div>
    )
}