import {useState} from "react";
import {socket} from "../socket";

const Lobby = ()=>{
const [username,setUsername] = useState(null);
const sessionID = localStorage.getItem("sessionID");
console.log(sessionID);
    if (sessionID) {
        socket.auth = { sessionID };
        socket.connect();
    }
const handleSubmit = (e) =>{
    e.preventDefault();
    if(username){
    console.log(username);
    socket.connect();
    socket.emit("add_user", username);
    }
};


return(
    <>
    <div className="lobby">
    <h1>MULTIVAR GAME</h1>
    <form onSubmit={handleSubmit}>
    <input className="usernameInput" name="input" placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
    <button className="lobbyButton">Join!</button>
    </form>
    </div>
    </>
);
};
export default Lobby;