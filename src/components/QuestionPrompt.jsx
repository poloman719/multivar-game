import { useState } from "react";

const QuestionPrompt = ({ question }) => {

  return (
    <div className="prompt">
      <div>
        <h1>Question</h1>
        <p>{question.question}</p>
      </div>
    </div>
  )
}

export default QuestionPrompt;