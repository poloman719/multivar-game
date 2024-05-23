import { useState, useEffect } from "react";
import { socket } from "../socket";

const Lobby = ({ users, user, isHost, gameState }) => {
  const [username, setUsername] = useState(null);
  const sessionID = localStorage.getItem("sessionID");
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState("");
  console.log(sessionID);
  console.log(users);

  useEffect(() => {
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      socket.emit("recover_user");
    }
  })
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      console.log(username);
      socket.connect();
      socket.emit("add_user", username);
    }
  };
  socket.on("late", () => {
    setGameStarted(true);
  });
  socket.on("start_game", () => setGameStarted(true))

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

  return (
    <>
      {!gameStarted ? (
        <div className='lobby'>
          <h1>INTERGALACTIC LINE BATTLE</h1>
          {users && <h3>Players</h3>}
          {users? <ul>
          {users?.map((user) => (
          <li key={user.id}><div>{user.name}</div></li>
          ))}
          </ul> : <p>No players ☹</p>}
          {!user && <form onSubmit={handleSubmit} className="userform">
            <input
              className='usernameInput'
              name='input'
              placeholder='Username'
              maxLength="26"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button className='lobbyButton'>Join!</button>
          </form>
          }
          {(!gameState && user) && (isHost ? (<button onClick={startGame}>Start Game</button>) : (<p>Please wait for the host to start the game.</p>)) }
          <p style={{color:'red'}}> {error}</p>
        </div>
      ) : (
        <h1 className='lobby'>The game has already started.</h1>
      )}
    </>
  );
};
export default Lobby;
