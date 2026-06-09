import React from 'react'
import '../styles/ResultScreen.css'

const ResultScreen = ({ score, totalQuestions, onRestart, onViewHistory }) => {
  const percentage = Math.round((score / totalQuestions) * 100)

  const getTitle = () => {
    if (percentage === 100) return '🏆 Hoàn hảo!'
    if (percentage >= 80) return '🥇 Xuất sắc!'
    if (percentage >= 60) return '🥈 Tốt lắm!'
    if (percentage >= 40) return '🥉 Không tệ!'
    return '💪 Cố gắng thêm!'
  }

  const getMessage = () => {
    if (percentage === 100) return 'Bạn là một chuyên gia địa lý!'
    if (percentage >= 80) return 'Bạn có kiến thức tuyệt vời về địa lý!'
    if (percentage >= 60) return 'Bạn có kiến thức khá tốt!'
    if (percentage >= 40) return 'Bạn đang trên con đường đúng!'
    return 'Hãy cố gắng luyện tập thêm!'
  }

  return (
    <div className="result-screen">
      <div className="result-card">
        <h1 className="result-title">{getTitle()}</h1>

        <div className="score-display">
          <div className="score-circle">
            <div className="percentage">{percentage}%</div>
            <div className="score-text">{score}/{totalQuestions}</div>
          </div>
        </div>

        <p className="result-message">{getMessage()}</p>

        <div className="stats">
          <div className="stat">
            <span className="label">Câu đúng</span>
            <span className="value">{score}</span>
          </div>
          <div className="stat">
            <span className="label">Câu sai</span>
            <span className="value">{totalQuestions - score}</span>
          </div>
        </div>

        <div className="result-buttons">
          <button className="restart-button" onClick={onRestart}>
            Chơi lại
          </button>
          {onViewHistory && (
            <button className="history-button" onClick={onViewHistory}>
              📊 Xem lịch sử
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultScreen
