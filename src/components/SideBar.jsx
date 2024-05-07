import { useState } from "react";

const SideBar = ({ setLine }) => {
  const [xi, setXi] = useState(null);
  const [yi, setYi] = useState(null);
  const [zi, setZi] = useState(null);
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [c, setC] = useState(null);

  const onXi = (e) => {
    e.target.value = Math.round(e.target.value);
    setXi(e.target.value);
  };
  const onYi = (e) => {
    e.target.value = Math.round(e.target.value);
    setYi(e.target.value);
  };
  const onZi = (e) => {
    e.target.value = Math.round(e.target.value);
    setZi(e.target.value);
  };
  const onA = (e) => {
    e.target.value = Math.round(e.target.value);
    setA(e.target.value);
  };
  const onB = (e) => {
    e.target.value = Math.round(e.target.value);
    setB(e.target.value);
  };
  const onC = (e) => {
    e.target.value = Math.round(e.target.value);
    setC(e.target.value);
  };

  const fireHandler = () => {
    if (!(xi && yi && zi && a && b && c)) return;
    setLine([
      { x: xi, y: yi, z: zi },
      { x: a, y: b, z: c },
    ]);
  };

  return (
    <div className='sidebar'>
      <div>
        x = <input type='number' step='1' onChange={onXi} /> +{" "}
        <input type='number' step='1' onChange={onA} />t
      </div>
      <div>
        y = <input type='number' step='1' onChange={onYi} /> +{" "}
        <input type='number' step='1' onChange={onB} />t
      </div>
      <div>
        z = <input type='number' step='1' onChange={onZi} /> +{" "}
        <input type='number' step='1' onChange={onC} />t
      </div>
      <button onClick={fireHandler}>Fire!</button>
    </div>
  );
};

export default SideBar;
