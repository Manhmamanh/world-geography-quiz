import React, { useState, useEffect } from 'react'
import '../styles/QuizApp.css'
import QuestionCard from './QuestionCard'
import ResultScreen from './ResultScreen'
import HistoryScreen from './HistoryScreen'

const QuizApp = () => {
  const [countries, setCountries] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizEnded, setQuizEnded] = useState(false)
  const [currentView, setCurrentView] = useState('home')

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const fields = 'name,capital,region,area,population,currencies,languages'
      const response = await fetch(`https://restcountries.com/v3.1/all?fields=${fields}`)
      const data = await response.json()
      setCountries(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching countries:', error)
      setIsLoading(false)
    }
  }

  const generateQuestions = () => {
    if (countries.length === 0) return []

    const questionList = []
    const usedCountries = new Set()

    while (questionList.length < 20) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)]
      const countryName = randomCountry.name.common

      if (usedCountries.has(countryName)) continue
      usedCountries.add(countryName)

      const difficulty = Math.ceil((questionList.length + 1) / 7)
      const question = generateQuestion(randomCountry, difficulty, questionList)

      if (question) {
        questionList.push(question)
      }
    }

    return questionList
  }

  const generateQuestion = (country, difficulty, existingQuestions) => {
    const types = ['capital', 'region', 'population', 'area', 'currency', 'language', 'official_name']
    let questionType

    switch (difficulty) {
      case 1:
        questionType = types[Math.floor(Math.random() * 3)]
        break
      case 2:
        questionType = types[Math.floor(Math.random() * 5) + 2]
        break
      case 3:
        questionType = types[Math.floor(Math.random() * 7)]
        break
      default:
        questionType = 'capital'
    }

    const question = createQuestion(country, questionType, existingQuestions, difficulty)
    return question
  }

  const createQuestion = (country, type, existingQuestions, difficulty) => {
    const countryName = country.name.common
    let questionText = ''
    let correctAnswer = ''
    let options = []

    switch (type) {
      case 'capital':
        if (!country.capital || country.capital.length === 0) return null
        correctAnswer = country.capital[0]
        questionText = `Thủ đô của ${countryName} là gì?`
        options = generateCapitalOptions(correctAnswer, existingQuestions)
        break

      case 'region':
        if (!country.region) return null
        correctAnswer = country.region
        questionText = `${countryName} nằm ở vùng nào?`
        options = generateRegionOptions(correctAnswer)
        break

      case 'population':
        if (!country.population) return null
        correctAnswer = formatPopulation(country.population)
        questionText = `Dân số của ${countryName} khoảng bao nhiêu?`
        options = generatePopulationOptions(country.population)
        break

      case 'area':
        if (!country.area) return null
        correctAnswer = formatArea(country.area)
        questionText = `Diện tích của ${countryName} khoảng bao nhiêu km²?`
        options = generateAreaOptions(country.area)
        break

      case 'currency':
        if (!country.currencies) return null
        correctAnswer = Object.keys(country.currencies)[0]
        questionText = `Tiền tệ chính của ${countryName} là gì?`
        options = generateCurrencyOptions(correctAnswer)
        break

      case 'language':
        if (!country.languages) return null
        correctAnswer = Object.values(country.languages)[0]
        questionText = `Ngôn ngữ chính của ${countryName} là gì?`
        options = generateLanguageOptions(correctAnswer)
        break

      case 'official_name':
        if (!country.name.official) return null
        correctAnswer = country.name.official
        questionText = `Tên chính thức của ${countryName} là gì?`
        options = generateNameOptions(correctAnswer, countryName)
        break

      default:
        return null
    }

    if (options.length < 4) return null

    return {
      question: questionText,
      correctAnswer,
      options: shuffleArray(options),
      difficulty,
      type,
      country: countryName
    }
  }

  const generateCapitalOptions = (correct, existingQuestions) => {
    const options = [correct]
    const capitals = countries
      .filter(c => c.capital && c.capital.length > 0)
      .map(c => c.capital[0])
      .filter(cap => cap !== correct)

    for (let i = 0; i < 3 && options.length < 4; i++) {
      const random = capitals[Math.floor(Math.random() * capitals.length)]
      if (!options.includes(random)) {
        options.push(random)
      }
    }

    return options.slice(0, 4)
  }

  const generateRegionOptions = (correct) => {
    const regions = [...new Set(countries.map(c => c.region).filter(Boolean))]
    const options = [correct]

    while (options.length < 4) {
      const random = regions[Math.floor(Math.random() * regions.length)]
      if (!options.includes(random)) {
        options.push(random)
      }
    }

    return options
  }

  const generatePopulationOptions = (correct) => {
    const populations = countries
      .map(c => c.population)
      .filter(Boolean)
      .sort((a, b) => a - b)

    const idx = populations.indexOf(correct)
    const nearby = populations.slice(Math.max(0, idx - 50), Math.min(populations.length, idx + 50))

    const options = [correct]
    while (options.length < 4) {
      const random = nearby[Math.floor(Math.random() * nearby.length)]
      if (!options.includes(random) && Math.abs(random - correct) > correct * 0.1) {
        options.push(random)
      }
    }

    return options.slice(0, 4)
  }

  const generateAreaOptions = (correct) => {
    const areas = countries.map(c => c.area).filter(Boolean).sort((a, b) => a - b)

    const idx = areas.indexOf(correct)
    const nearby = areas.slice(Math.max(0, idx - 30), Math.min(areas.length, idx + 30))

    const options = [correct]
    while (options.length < 4) {
      const random = nearby[Math.floor(Math.random() * nearby.length)]
      if (!options.includes(random) && Math.abs(random - correct) > correct * 0.1) {
        options.push(random)
      }
    }

    return options.slice(0, 4)
  }

  const generateCurrencyOptions = (correct) => {
    const currencies = [correct]
    const allCurrencies = countries
      .flatMap(c => c.currencies ? Object.keys(c.currencies) : [])
      .filter(curr => curr !== correct)

    while (currencies.length < 4 && allCurrencies.length > 0) {
      const random = allCurrencies[Math.floor(Math.random() * allCurrencies.length)]
      if (!currencies.includes(random)) {
        currencies.push(random)
      }
    }

    return currencies.slice(0, 4)
  }

  const generateLanguageOptions = (correct) => {
    const languages = [correct]
    const allLanguages = countries
      .flatMap(c => c.languages ? Object.values(c.languages) : [])
      .filter(lang => lang !== correct)

    while (languages.length < 4 && allLanguages.length > 0) {
      const random = allLanguages[Math.floor(Math.random() * allLanguages.length)]
      if (!languages.includes(random)) {
        languages.push(random)
      }
    }

    return languages.slice(0, 4)
  }

  const generateNameOptions = (correct, countryName) => {
    const options = [correct]
    const officialNames = countries
      .map(c => c.name.official)
      .filter(name => name !== correct)

    while (options.length < 4 && officialNames.length > 0) {
      const random = officialNames[Math.floor(Math.random() * officialNames.length)]
      if (!options.includes(random)) {
        options.push(random)
      }
    }

    return options.slice(0, 4)
  }

  const formatPopulation = (pop) => {
    if (pop >= 1000000000) return `${(pop / 1000000000).toFixed(1)} tỷ`
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)} triệu`
    return `${(pop / 1000).toFixed(0)} nghìn`
  }

  const formatArea = (area) => {
    return Math.round(area).toLocaleString('vi-VN')
  }

  const shuffleArray = (arr) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startQuiz = () => {
    const newQuestions = generateQuestions()
    setQuestions(newQuestions)
    setCurrentQuestion(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setQuizStarted(true)
    setQuizEnded(false)
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    setAnswered(true)

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setQuizEnded(true)
    }
  }

  const saveQuizResult = () => {
    try {
      const result = {
        score,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }
      const history = JSON.parse(localStorage.getItem('quiz_history') || '[]')
      history.unshift(result)
      localStorage.setItem('quiz_history', JSON.stringify(history.slice(0, 50)))
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  const restartQuiz = () => {
    setQuizStarted(false)
    setQuizEnded(false)
    setCurrentQuestion(0)
    setScore(0)
    setCurrentView('home')
  }

  const viewHistory = () => {
    setCurrentView('history')
  }

  if (isLoading) {
    return <div className="loading">Đang tải dữ liệu...</div>
  }

  if (currentView === 'history') {
    return <HistoryScreen onBack={() => setCurrentView('home')} />
  }

  if (!quizStarted) {
    return (
      <div className="container start-screen">
        <div className="welcome-card">
          <h1>🌍 Học Địa Lý Thế Giới</h1>
          <p className="subtitle">Kiến thức về các quốc gia thế giới</p>
          <div className="info">
            <p>📝 20 câu hỏi</p>
            <p>📈 Mức độ khó tăng dần</p>
            <p>🌐 Từ toàn bộ các quốc gia</p>
          </div>
          <button className="start-button" onClick={startQuiz}>
            Bắt đầu
          </button>
          <button className="history-link-btn" onClick={viewHistory}>
            📊 Xem lịch sử
          </button>
        </div>
      </div>
    )
  }

  if (quizEnded) {
    saveQuizResult()
    return <ResultScreen score={score} totalQuestions={questions.length} onRestart={restartQuiz} onViewHistory={viewHistory} />
  }

  return (
    <div className="container">
      <div className="quiz-header">
        <div className="progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
          </div>
          <p>{currentQuestion + 1}/20</p>
        </div>
        <div className="score">Điểm: {score}</div>
      </div>

      {questions.length > 0 && (
        <QuestionCard
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
          answered={answered}
          selectedAnswer={selectedAnswer}
          questionNumber={currentQuestion + 1}
        />
      )}

      {answered && (
        <button className="next-button" onClick={nextQuestion}>
          {currentQuestion === questions.length - 1 ? 'Kết thúc' : 'Câu tiếp theo'}
        </button>
      )}
    </div>
  )
}

export default QuizApp
