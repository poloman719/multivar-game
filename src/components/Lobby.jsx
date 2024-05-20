import {useState} from "react";
import {socket} from "../socket";

const Lobby = ()=>{
const [username,setUsername] = useState(null);
const sessionID = localStorage.getItem("sessionID");
const[gameStarted, setGameStarted] = useState(false);
console.log(sessionID);
    if (sessionID) {
        socket.auth = { sessionID };
        socket.connect();
        socket.emit("recover_user")
    }
const handleSubmit = (e) =>{
    e.preventDefault();
    if(username){
    console.log(username);
    socket.connect();
    socket.emit("add_user", username);
    }
};
socket.on("late",()=>{
    setGameStarted(true);
});

return(
    <>
    {!gameStarted? <div className="lobby">
    <h1>MULTIVAR GAME</h1>
    <form onSubmit={handleSubmit}>
    <input className="usernameInput" name="input" placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
    <button className="lobbyButton">Join!</button>
    </form>
    </div> : <h1 className="lobby">The game has already started.</h1>}
    </>
);
};
export default Lobby;