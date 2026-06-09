import React from 'react'
import '../styles/QuestionCard.css'

const QuestionCard = ({ question, onAnswer, answered, selectedAnswer, questionNumber }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1:
        return 'easy'
      case 2:
        return 'medium'
      case 3:
        return 'hard'
      default:
        return 'easy'
    }
  }

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1:
        return '⭐ Dễ'
      case 2:
        return '⭐⭐ Trung bình'
      case 3:
        return '⭐⭐⭐ Khó'
      default:
        return 'Dễ'
    }
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className={`difficulty ${getDifficultyColor(question.difficulty)}`}>
          {getDifficultyLabel(question.difficulty)}
        </span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="options">
        {question.options.map((option, index) => {
          const isCorrect = option === question.correctAnswer
          const isSelected = option === selectedAnswer
          let className = 'option'

          if (answered) {
            if (isCorrect) {
              className += ' correct'
            } else if (isSelected && !isCorrect) {
              className += ' incorrect'
            }
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => !answered && onAnswer(option)}
              disabled={answered}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {answered && isCorrect && <span className="check">✓</span>}
              {answered && isSelected && !isCorrect && <span className="cross">✗</span>}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`feedback ${selectedAnswer === question.correctAnswer ? 'success' : 'error'}`}>
          {selectedAnswer === question.correctAnswer
            ? '✓ Đúng rồi!'
            : `✗ Sai rồi! Đáp án đúng là: ${question.correctAnswer}`}
        </div>
      )}
    </div>
  )
}

export default QuestionCard
