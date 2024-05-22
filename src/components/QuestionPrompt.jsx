import { useState } from "react";
import { socket } from "../socket";

const QuestionPrompt = ({ question, markCorrect, setAnswering, answering }) => {
  const [response, setResponse] = useState("");
  const [answer, setAnswer] = useState(null);
  const [renderedAnswer, setRenderedAnswer] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    setRenderedAnswer(answer);
    if (answer==question.answer) {
      setResponse("Correct!");
    } else
      setResponse("WRONG! Looks like SOMEONE needs to go back to MATH SCHOOL...");
    setAnswering(false);
  };

  return (
    <div className="prompt">
      <div className="prompt-inner">
        <h1>Question {question.number}</h1>
        <p>{question.question}</p>
        {!response && <form onSubmit={handleSubmit}>
          <input onChange={(e) => setAnswer(e.target.value)} type="text" />
          <button>Submit</button>
        </form>}
        <p>Your answer: <b>{renderedAnswer}</b></p>
        <p>{response}</p>
        {!answering && <button onClick={()=>{markCorrect();setResponse("");}}>Close</button>}
        </div>
        <div>
      
      </div>
    </div>
  )
}

export default QuestionPrompt;