import { useState } from "react";
import { Vector3 } from "three";

const SideBar = ({ fire }) => {
  const [xi, setXi] = useState(null);
  const [yi, setYi] = useState(null);
  const [zi, setZi] = useState(null);
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [c, setC] = useState(null);
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

  const fireHandler = () => {
    if (!(xi && yi && zi && a && b && c)) return;
    fire([
      new Vector3(parseInt(xi), parseInt(zi), parseInt(yi)),
      new Vector3(parseInt(a), parseInt(c), parseInt(b))
    ]);
    setPara(Math.random() > .5);
  };

  const moveHandler = () => {
    alert("waaaa")
  }

  return (
    <div className='sidebar'>
      {para ? <div>
        x = <input type='number' step='1' onChange={onXi} /> +{" "}
        <input type='number' step='1' onChange={onA} />t
      </div> : <div className="frac"><div className="frac-top">x -{" "}<input type='number' step='1' onChange={onXi} /></div><input className="frac-bot" type='number' step='1' onChange={onA} />=</div>}
      {para ? <div>
        y = <input type='number' step='1' onChange={onYi} /> +{" "}
        <input type='number' step='1' onChange={onB} />t
      </div> : <div className="frac"><div className="frac-top">y -{" "}<input type='number' step='1' onChange={onYi} /></div><input className="frac-bot" type='number' step='1' onChange={onB} />=</div>}
      {para ? <div>
        z = <input type='number' step='1' onChange={onZi} /> +{" "}
        <input type='number' step='1' onChange={onC} />t
      </div> : <div className="frac"><div className="frac-top">z -{" "}<input type='number' step='1' onChange={onZi} /></div><input className="frac-bot" type='number' step='1' onChange={onC} /></div>}
      <button onClick={fireHandler}>Fire!</button>
      <input type='number' step='1' />
      <input type='number' step='1' />
      <input type='number' step='1' />
      <button onClick={moveHandler}>Move</button>
    </div>
  );
};

export default SideBar;
