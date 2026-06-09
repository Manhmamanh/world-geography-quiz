import React, { useState, useEffect } from 'react'
import '../styles/HistoryScreen.css'

const HistoryScreen = ({ onBack }) => {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const data = localStorage.getItem('quiz_history')
      const h = data ? JSON.parse(data) : []
      setHistory(h)
      if (h.length) {
        const total = h.length
        const correct = h.reduce((sum, item) => sum + item.score, 0)
        const questions = h.reduce((sum, item) => sum + item.totalQuestions, 0)
        const avg = Math.round((correct / questions) * 100)
        const best = Math.max(...h.map(item => Math.round((item.score / item.totalQuestions) * 100)))
        setStats({ total, correct, questions, avg, best })
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const clearHistory = () => {
    if (confirm('Bạn chắc chắn muốn xóa tất cả lịch sử?')) {
      localStorage.removeItem('quiz_history')
      setHistory([])
      setStats(null)
    }
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    const date = d.toLocaleDateString('vi-VN')
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    return `${date} ${time}`
  }

  const getColor = (pct) => {
    if (pct >= 80) return '#4caf50'
    if (pct >= 60) return '#2196f3'
    if (pct >= 40) return '#ff9800'
    return '#f44336'
  }

  return (
    <div className="history-screen">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>← Quay lại</button>
        <h1>📊 Lịch sử chơi</h1>
      </div>

      {stats && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-label">Tổng lần chơi</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-label">Điểm trung bình</div>
            <div className="stat-value">{stats.avg}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-label">Điểm tốt nhất</div>
            <div className="stat-value">{stats.best}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-label">Tổng câu đúng</div>
            <div className="stat-value">{stats.correct}/{stats.questions}</div>
          </div>
        </div>
      )}

      <div className="history-list-container">
        {history.length > 0 ? (
          <>
            <h2>Các lần chơi gần đây</h2>
            <div className="history-list">
              {history.map((item, idx) => {
                const pct = Math.round((item.score / item.totalQuestions) * 100)
                const color = getColor(pct)
                return (
                  <div key={idx} className="history-item" style={{ borderLeftColor: color }}>
                    <div className="history-info">
                      <div className="history-date">{formatDate(item.timestamp)}</div>
                      <div className="history-detail">{item.score}/{item.totalQuestions} câu đúng</div>
                    </div>
                    <div className="history-score" style={{ color }}>
                      <span className="history-percentage">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <button className="clear-btn" onClick={clearHistory}>🗑️ Xóa lịch sử</button>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Chưa có lịch sử. Bắt đầu chơi để lưu lại!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryScreen
