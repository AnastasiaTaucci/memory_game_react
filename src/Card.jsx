export default function Card(props) {

    const cardClass = `card ${props.flipped ? "flipped" : props.color}`;
    
    return <div className={cardClass} onClick={props.onClick}>{props.flipped ? props.symbol : ""}</div>
}