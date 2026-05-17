

function App() {
    // Get questions from external file
    const quizData = window.quizData;

    // State variables (each declared once)
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [selectedAnswer, setSelectedAnswer] = React.useState(null);
    const [score, setScore] = React.useState(0);
    const [showResult, setShowResult] = React.useState(false);

    const currentQ = quizData[currentQuestion];
    const isAnswered = selectedAnswer !== null;
    const isCorrect = isAnswered && (selectedAnswer === currentQ.correct);

    // Handle answer click (only if not yet answered)
    const handleAnswerClick = (optionIndex) => {
      if (isAnswered) return;
      setSelectedAnswer(optionIndex);
    };

    // Move to next question or finish
    const handleNext = () => {
      if (!isAnswered) return;

      if (isCorrect) {
        setScore(score + 1);
      }

      setSelectedAnswer(null);

      if (currentQuestion + 1 < quizData.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    };

    const restartQuiz = () => {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setShowResult(false);
    };

    // Determine class for each option button based on feedback
    const getOptionClassName = (optIndex) => {
      if (!isAnswered) return "option-btn";
      // Always highlight the correct answer in green
      if (optIndex === currentQ.correct) return "option-btn correct-highlight";
      // If user chose this option and it's wrong → red
      if (optIndex === selectedAnswer && optIndex !== currentQ.correct) return "option-btn wrong-highlight";
      // All other options become gray
      return "option-btn disabled-other";
    };

    // Result screen
    if (showResult) {
      return (
        <div className="quiz-container">
          <h2>📝 Quiz Completed!</h2>
          <p className="score">
            {score} / {quizData.length}
          </p>
          <button className="restart-btn" onClick={restartQuiz}>
            🔄 Restart Quiz
          </button>
        </div>
      );
    }

    // Feedback message (below options)
    let feedbackMessage = null;
    if (isAnswered) {
      if (isCorrect) {
        feedbackMessage = <div className="feedback-message feedback-correct">✅ Correct! Great job.</div>;
      } else {
        feedbackMessage = (
          <div className="feedback-message feedback-wrong">
            ❌ Wrong! The correct answer is: <strong>"{currentQ.options[currentQ.correct]}"</strong>
          </div>
        );
      }
    }

    // Active question screen
    return (
      <div className="quiz-container">
        <div className="question-header">
          <span className="badge">Question {currentQuestion + 1} / {quizData.length}</span>
          <span className="badge">⭐ Score: {score}</span>
        </div>
        <h2>{currentQ.question}</h2>

        <div className="options">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              className={getOptionClassName(idx)}
              onClick={() => handleAnswerClick(idx)}
              disabled={isAnswered}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>

        {feedbackMessage}

        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {currentQuestion + 1 === quizData.length ? "🏁 Finish" : "➡ Next"}
        </button>

    <div id="footer">
      <p>
© {new Date().getFullYear()} The Wheelchair Guy
   </p>
      </div>






      </div>
  
    );
  }

ReactDOM.render(<App />, document.getElementById("root"));