import { useState } from "react";
import { socket } from "../socket";

const SideBar = ({ users, isHost, gameState, setMode }) => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [para, setPara] = useState(true);
  const [error, setError] = useState("");
  
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
    console.log("bru");
    setMode("fire");
    socket.emit("get_question");
  };

  const moveHandler = () => {
    setMode("move");
    socket.emit("get_question");
  };

  const killHandler = id => {
    socket.emit("kill",id);
  }

  return (
    <div className='sidebar'>
      <h2>Players</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}{isHost&&<button onClick={() => killHandler(user.id)}>Murder</button>}</li>
        ))}
      </ul>
      {/* {!loggedIn && <button onClick={addUser}>Add User</button>} */}
      {!gameState && isHost && <button onClick={startGame}>Start Game</button> }
      {gameState && isHost && <button onClick={endGame}>End Game</button>}
      {gameState && <button onClick={fireHandler}>Fire!</button>}
      {gameState && <button onClick={moveHandler}>Move!</button>}
      <p>{error}</p>
    </div>
  );
};

export default SideBar;
