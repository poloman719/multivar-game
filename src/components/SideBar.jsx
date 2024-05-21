import { useState } from "react";
import { Vector3 } from "three";
import { socket } from "../socket";

const SideBar = ({ fire, move, TEMPORARY, isHost, gameState }) => {
  const [xi, setXi] = useState("");
  const [yi, setYi] = useState("");
  const [zi, setZi] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [para, setPara] = useState(true);
  const [error, setError] = useState("");

  const onXi = (e) => {
    // e.target.value = Math.round(e.target.value);
    setXi(e.target.value);
  };
  const onYi = (e) => {
    // e.target.value = Math.round(e.target.value);
    setYi(e.target.value);
  };
  const onZi = (e) => {
    // e.target.value = Math.round(e.target.value);
    setZi(e.target.value);
  };
  const onA = (e) => {
    // e.target.value = Math.round(e.target.value);
    setA(e.target.value);
  };
  const onB = (e) => {
    // e.target.value = Math.round(e.target.value);
    setB(e.target.value);
  };
  const onC = (e) => {
    // e.target.value = Math.round(e.target.value);
    setC(e.target.value);
  };
  
  // const addUser = () => {
  //   socket.emit("add_user", userInput.current.value);
  // };

  const startGame = () => {
    if (!isHost) return;
    socket.emit('start_game',(res)=>{
      if(res=!null&&res.status=="rejected"){
        console.log(res);
        setError("You need at least 2 people in the lobby to start a game.");
        setTimeout(()=>{
          setError("");
        },5000);
      }
      else
        setError("");
    })
  }

  const endGame = () =>{
    if(!isHost) return;
    console.log("end the game NOW!!!!!");
    socket.emit('end_game');
  }

  const fireHandler = () => {
    if (!(a && b && c)) return;
    // fire([
    //   new Vector3(parseInt(xi), parseInt(zi), parseInt(yi)),
    //   new Vector3(parseInt(a), parseInt(c), parseInt(b)),
    // ]);
    const fireData = [parseFloat(a), parseFloat(c), parseFloat(b)];

    socket.emit("fire",fireData);
    setPara((para) => (Math.random() < 0.75 ? !para : para));
    setXi("");
    setYi("");
    setZi("");
    setA("");
    setB("");
    setC("");
  };

  const moveHandler = () => {
    if (!(a && b && c)) return;
    socket.emit("move", [parseFloat(a), parseFloat(c), parseFloat(b)]);
    setPara((para) => (Math.random() < 0.75 ? !para : para));
    setXi("");
    setYi("");
    setZi("");
    setA("");
    setB("");
    setC("");
  };

  return (
    <div className='sidebar'>
      <h2>Players</h2>
      <ul>
        {TEMPORARY?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      {/* {!loggedIn && <button onClick={addUser}>Add User</button>} */}
      {!gameState && isHost && <button onClick={startGame}>Start Game</button> }
      {gameState && isHost && <button onClick={endGame}>End Game</button>}
      {para ? (
        <div>
          x = x<sub>0</sub> +{" "}
          <input type='number' onChange={onA} value={a} />t
        </div>
      ) : (
        <div className='frac'>
          <div className='frac-top'>
            x - x<sub>0</sub>
          </div>
          <input className='frac-bot' type='number' onChange={onA} value={a} />=
        </div>
      )}
      {para ? (
        <div>
          y = y<sub>0</sub> +{" "}
          <input type='number' onChange={onB} value={b} />t
        </div>
      ) : (
        <div className='frac'>
          <div className='frac-top'>
            y - y<sub>0</sub>
          </div>
          <input className='frac-bot' type='number' onChange={onB} value={b} />=
        </div>
      )}
      {para ? (
        <div>
          z = z<sub>0</sub> +{" "}
          <input type='number' onChange={onC} value={c} />t
        </div>
      ) : (
        <div className='frac'>
          <div className='frac-top'>
            z - z<sub>0</sub>
          </div>
          <input className='frac-bot' type='number' onChange={onC} value={c} />
        </div>
      )}
      <button onClick={fireHandler}>Fire!</button>
      <button onClick={moveHandler}>Move!</button>
      <p>{error}</p>
    </div>
  );
};

export default SideBar;
