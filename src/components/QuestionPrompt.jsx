import { useState } from "react";
import { socket } from "../socket";

const QuestionPrompt = ({ question, markCorrect, mode }) => {
  const [response, setResponse] = useState("");
  const [answer, setAnswer] = useState(null);
  const [answering, setAnswering] = useState(true);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [para, setPara] = useState(true);
  
  const onA = (e) => {
    // e.target.value = Math.round(e.target.value);
    if(e.target.value<=2 && e.target.value>=-2)
      setA(e.target.value);
  };
  const onB = (e) => {
    // e.target.value = Math.round(e.target.value);
    if(e.target.value<=2 && e.target.value>=-2)
      setB(e.target.value);
  };
  const onC = (e) => {
    // e.target.value = Math.round(e.target.value);
    if(e.target.value<=2 && e.target.value>=-2)
      setC(e.target.value);
  };

  const fireHandler = () => {
    if (!(a && b && c)) return;
    const fireData = [parseFloat(a), parseFloat(c), parseFloat(b)];

    socket.emit("fire",fireData);
    setPara((para) => (Math.random() < 0.75 ? !para : para));
    setA("");
    setB("");
    setC("");
  };

  const moveHandler = () => {
    if (!(a && b && c)) return;
    socket.emit("move", [parseFloat(a), parseFloat(c), parseFloat(b)]);
    setPara((para) => (Math.random() < 0.75 ? !para : para));
    setA("");
    setB("");
    setC("");
  };

  const handleSubmit = e =>{
    e.preventDefault();
    if (answer==question.answer) {
      setResponse("Correct!");
      setAnswering(false);
    } else
      setResponse("WRONG! Looks like SOMEONE needs to go back to MATH SCHOOL...");
    setTimeout(() => {
      setResponse("")
      markCorrect();
    },5000);
  };

  const inputHandler = () =>{
    if(mode == "fire")
      fireHandler();
    else
      moveHandler();
    markCorrect();
  }

  return (
    <div className="prompt">
      <div className="prompt-inner">
        {answering && <div>
        <h1>Question {question.number}</h1>
        <p>{question.question}</p>
        <form onSubmit={handleSubmit}>
          <input onChange={(e) => setAnswer(e.target.value)} type="text" />
          <button>Submit</button>
        </form>
        <p>{response}</p>
        </div>}
        <div>
          
        {!answering && ((para ? (
          <div>
          
        <div>
          x = x<sub>0</sub> +{" "}
          <input max="2" min="-2" type='number' onChange={onA} value={a} />t
        </div>
        <div>
        y = y<sub>0</sub> +{" "}
        <input max="2" min="-2" type='number' onChange={onB} value={b} />t
      </div>
      <div>
          z = z<sub>0</sub> +{" "}
          <input max="2" min="-2" type='number' onChange={onC} value={c} />t
        </div>
      </div>   
      ) : (
        <div>
        <div className='frac'>
          <div className='frac-top'>
            x - x<sub>0</sub>
          </div>
          <input max="2" min="-2" className='frac-bot' type='number' onChange={onA} value={a} />=
        </div>
        <div className='frac'>
          <div className='frac-top'>
            y - y<sub>0</sub>
          </div>
          <input max="2" min="-2" className='frac-bot' type='number' onChange={onB} value={b} />=
        </div>
        <div className='frac'>
          <div className='frac-top'>
            z - z<sub>0</sub>
          </div>
          <input max="2" min="-2" className='frac-bot' type='number' onChange={onC} value={c} />
        </div>
        </div>
      ))
      )}
      {!answering && <button onClick={inputHandler}>Submit Inputs</button>}
        </div>
      </div>
    </div>
  )
}

export default QuestionPrompt;