import { useState } from "react";
import { socket } from "../socket";

const QuestionPrompt = ({ question, markCorrect, setAnswering }) => {
  const [response, setResponse] = useState("");
  const [answer, setAnswer] = useState(null);
  const [renderedAnswer, setRenderedAnswer] = useState("");
  const [buttonStatus, setButtonStatus] = useState("");
  const type = question.type;
  console.log(type);
  const [xi, setXi] = useState("");
  const [yi, setYi] = useState("");
  const [zi, setZi] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");

  const onXi = (e) => {
    // e.target.value = Math.round(e.target.value);
    // if(e.target.value<=2 && e.target.value>=-2)
    setXi(e.target.value);
  };
  const onYi = (e) => {
    // e.target.value = Math.round(e.target.value);
    // if(e.target.value<=2 && e.target.value>=-2)
    setYi(e.target.value);
  };
  const onZi = (e) => {
    // e.target.value = Math.round(e.target.value);
    // if(e.target.value<=2 && e.target.value>=-2)
    setZi(e.target.value);
  };

  const onA = (e) => {
    // e.target.value = Math.round(e.target.value);
    // if(e.target.value<=2 && e.target.value>=-2)
    setA(e.target.value);
  };
  const onB = (e) => {
    // e.target.value = Math.round(e.target.value);
    // if(e.target.value<=2 && e.target.value>=-2)
    setB(e.target.value);
  };
  const onC = (e) => {
    // e.target.value = Math.round(e.target.value);
    // if(e.target.value<=2 && e.target.value>=-2)
    setC(e.target.value);
  };
  const onD = (e) => {
    // e.target.value = Math.round(e.target.value);
    // if(e.target.value<=2 && e.target.value>=-2)
    setD(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correct = false;
    switch (type) {
      case "plane":
        // if (question.as)
        break;
      case "point":

        break;
      default:
        correct = answer == question.answer;
    }
    if (correct) {
      setResponse("Correct!");
      setAnswering(false);
      setButtonStatus("Close");
    } else {
      setResponse(
        "WRONG! Looks like SOMEONE needs to go back to MATH SCHOOL..."
      );
      setButtonStatus("Retry");
    }
  };

  return (
    <div className='prompt'>
      <div className='prompt-inner'>
        <h1>Question {question.number}</h1>
        <p>{question.question}</p>
        {!response && (
          <form onSubmit={handleSubmit}>
            {type == "reg" && (
              <input onChange={(e) => setAnswer(e.target.value)} type='text' />
            )}
            {/* {type == "line" && (
              <>
                <div>
                  x ={" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onXi}
                    value={xi}
                  />{" "}
                  +{" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onA}
                    value={a}
                  />
                  t
                </div>
                <div>
                  y ={" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onYi}
                    value={yi}
                  />{" "}
                  +{" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onB}
                    value={b}
                  />
                  t
                </div>
                <div>
                  z ={" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onZi}
                    value={zi}
                  />{" "}
                  +{" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onC}
                    value={c}
                  />
                  t
                </div>
              </>
            )} */}
            {type == "plane" && (
                <div>
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onA}
                    value={a}
                  />x + {" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onB}
                    value={b}
                  />y + {" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onC}
                    value={c}
                  />z + {" "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onD}
                    value={d}
                  />
                </div>
            )}
            {type == "plane" && (
                <div>
                  {"("}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onA}
                    value={a}
                  />{", "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onB}
                    value={b}
                  />{", "}
                  <input
                    max='2'
                    min='-2'
                    type='number'
                    onChange={onC}
                    value={c}
                  />{")"}
                </div>
            )}
            <button>Submit</button>
          </form>
        )}
        <p>
          Your answer: <b>{renderedAnswer}</b>
        </p>
        <p>{response}</p>
        {response && (
          <button
            onClick={() => {
              if (response == "Correct!") markCorrect();
              setResponse("");
            }}
          >
            Close
          </button>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default QuestionPrompt;
