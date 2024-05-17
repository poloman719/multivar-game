import { useState } from "react";
import { Vector3 } from "three";
import { socket } from "../socket";

const SideBar = ({ fire, move, setUser }) => {
  const [xi, setXi] = useState("");
  const [yi, setYi] = useState("");
  const [zi, setZi] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [para, setPara] = useState(true);

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
  const onUserInput = (e) => setUser(e.target.value);

  const fireHandler = () => {
    try {
      socket.emit('fire', 'fire shot')
    } catch (err) { alert(err)}
    if (!(xi && yi && zi && a && b && c)) return;
    fire([
      new Vector3(parseInt(xi), parseInt(zi), parseInt(yi)),
      new Vector3(parseInt(a), parseInt(c), parseInt(b)),
    ]);
    setPara((para) => (Math.random() < 0.75 ? !para : para));
    setXi("");
    setYi("");
    setZi("");
    setA("");
    setB("");
    setC("");
  };

  const moveHandler = () => {
    if (!(xi && yi && zi && a && b && c)) return;
    move([
      new Vector3(parseInt(xi), parseInt(zi), parseInt(yi)),
      new Vector3(parseInt(a), parseInt(c), parseInt(b)),
    ]);
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
      <div className='userinput'>
        <span>User: </span>
        <input onChange={onUserInput}></input>
      </div>
      {para ? (
        <div>
          x = <input type='number' onChange={onXi} value={xi} /> +{" "}
          <input type='number' onChange={onA} value={a} />t
        </div>
      ) : (
        <div className='frac'>
          <div className='frac-top'>
            x -{" "}
            <input type='number' onChange={onXi} value={xi} />
          </div>
          <input className='frac-bot' type='number' onChange={onA} value={a} />=
        </div>
      )}
      {para ? (
        <div>
          y = <input type='number' onChange={onYi} value={yi} /> +{" "}
          <input type='number' onChange={onB} value={b} />t
        </div>
      ) : (
        <div className='frac'>
          <div className='frac-top'>
            y -{" "}
            <input type='number' onChange={onYi} value={yi} />
          </div>
          <input className='frac-bot' type='number' onChange={onB} value={b} />=
        </div>
      )}
      {para ? (
        <div>
          z = <input type='number' onChange={onZi} value={zi} /> +{" "}
          <input type='number' onChange={onC} value={c} />t
        </div>
      ) : (
        <div className='frac'>
          <div className='frac-top'>
            z -{" "}
            <input type='number' onChange={onZi} value={zi} />
          </div>
          <input className='frac-bot' type='number' onChange={onC} value={c} />
        </div>
      )}
      <button onClick={fireHandler}>Fire!</button>
      <button onClick={moveHandler}>Move!</button>
    </div>
  );
};

export default SideBar;
