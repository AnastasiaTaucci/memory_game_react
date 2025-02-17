export default function Controls(props) {

    return (
    <div className="controls">
        <select id="chosen-color" value={props.selectedColor} onChange={(event) => props.handleChangeColor(event)}>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="pink">Pink</option>
        </select>
        <button id="restart-btn" onClick={props.handleReset}>Restart Game</button>
    </div>
    )
}