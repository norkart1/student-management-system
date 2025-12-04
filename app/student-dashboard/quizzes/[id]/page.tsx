"use client"

import { useState, useEffect, use, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  LogOut,
  User,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Trophy,
  AlertCircle,
  Send,
  Printer
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Question {
  question: string
  type: "multiple_choice" | "true_false"
  options: string[]
  correctAnswer: number
  points: number
}

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  passingScore: number
  questions: Question[]
  status: string
}

interface AnswerResult {
  questionIndex: number
  selectedAnswer: number
  isCorrect: boolean
  correctAnswer: number
}

export default function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [started, setStarted] = useState(false)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<{ isCorrect: boolean; correctAnswer: number } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("student_token")
    const storedData = localStorage.getItem("student_data")

    if (!token || !storedData) {
      router.push("/student-login")
      return
    }

    const studentData = JSON.parse(storedData)
    setStudent(studentData)
    fetchQuiz(token)
  }, [router, id])

  useEffect(() => {
    if (!started || !quiz || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, quiz, timeLeft])

  const fetchQuiz = async (token: string) => {
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setQuiz(data)
        setTimeLeft(data.duration * 60)
      } else {
        router.push("/student-dashboard/quizzes")
      }
    } catch (error) {
      console.error("Failed to fetch quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("student_token")
    localStorage.removeItem("student_data")
    router.push("/student-login")
  }

  const handleStartQuiz = () => {
    setStarted(true)
  }

  const handleSelectAnswer = (answerIndex: number) => {
    if (showingFeedback || !quiz) return

    const question = quiz.questions[currentQuestion]
    const isCorrect = answerIndex === question.correctAnswer

    const newResult: AnswerResult = {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex,
      isCorrect,
      correctAnswer: question.correctAnswer
    }

    setAnswerResults([...answerResults, newResult])
    setCurrentFeedback({ isCorrect, correctAnswer: question.correctAnswer })
    setShowingFeedback(true)

    setTimeout(() => {
      setShowingFeedback(false)
      setCurrentFeedback(null)
      
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        handleAutoSubmit()
      }
    }, isCorrect ? 1000 : 2000)
  }

  const handleAutoSubmit = useCallback(async () => {
    const token = localStorage.getItem("student_token")
    if (!token || submitting) return

    setSubmitting(true)
    try {
      const answers = answerResults.map(r => ({
        questionIndex: r.questionIndex,
        selectedAnswer: r.selectedAnswer
      }))

      const res = await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: id,
          answers
        })
      })

      const data = await res.json()
      if (res.ok) {
        setResult({
          ...data,
          answerResults
        })
      } else {
        alert(data.error || "Failed to submit quiz")
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error)
    } finally {
      setSubmitting(false)
    }
  }, [answerResults, id, submitting])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  if (result) {
    const correctCount = answerResults.filter(r => r.isCorrect).length
    const totalQuestions = quiz.questions.length

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596] p-4 print:bg-white print:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm print:shadow-none">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  result.passed ? "bg-emerald-100" : "bg-red-100"
                }`}>
                  {result.passed ? (
                    <Trophy className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-500" />
                  )}
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 ${result.passed ? "text-emerald-600" : "text-red-600"}`}>
                  {result.passed ? "Congratulations!" : "Keep Practicing!"}
                </h2>
                
                <p className="text-slate-600 mb-6">{result.message}</p>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="text-4xl font-bold text-[#205072] mb-1">
                    {result.percentage}%
                  </div>
                  <p className="text-slate-500">
                    {result.score} out of {result.totalPoints} points
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    {correctCount} of {totalQuestions} questions correct
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <h3 className="font-semibold text-[#205072] mb-4">Question Review</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto print:max-h-none print:overflow-visible">
                  {quiz.questions.map((question, idx) => {
                    const answerResult = answerResults.find(r => r.questionIndex === idx)
                    const isCorrect = answerResult?.isCorrect
                    const selectedAnswer = answerResult?.selectedAnswer
                    
                    return (
                      <div key={idx} className={`p-4 rounded-xl border-2 ${
                        isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                      }`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect ? "bg-emerald-500" : "bg-red-500"
                          }`}>
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <XCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-[#205072] text-sm">
                              Q{idx + 1}: {question.question}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-9 space-y-2">
                          {question.options.map((option, optIdx) => (
                            <div 
                              key={optIdx}
                              className={`text-sm p-2 rounded-lg ${
                                optIdx === question.correctAnswer
                                  ? "bg-emerald-100 text-emerald-700 font-medium"
                                  : optIdx === selectedAnswer && !isCorrect
                                    ? "bg-red-100 text-red-700 line-through"
                                    : "text-slate-600"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}. {option}
                              {optIdx === question.correctAnswer && (
                                <span className="ml-2 text-emerald-600">(Correct)</span>
                              )}
                              {optIdx === selectedAnswer && !isCorrect && (
                                <span className="ml-2 text-red-600">(Your Answer)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 print:hidden">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Result
                </Button>
                <Link href="/student-dashboard/quizzes" className="flex-1">
                  <Button className="w-full gap-2 bg-gradient-to-r from-[#329D9C] to-[#56C596] text-white">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Quizzes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596]">
        <header className="bg-[#205072]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#56C596] to-[#7BE495] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white text-sm sm:text-base block truncate">Bright Future Academy</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="w-full max-w-2xl mx-auto px-4 py-8">
          <Link 
            href="/student-dashboard/quizzes"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
          </Link>

          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#329D9C]/20 to-[#56C596]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileQuestion className="w-10 h-10 text-[#329D9C]" />
              </div>
              
              <h1 className="text-2xl font-bold text-[#205072] mb-2">{quiz.title}</h1>
              <p className="text-slate-500 mb-6">{quiz.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-4">
                  <FileQuestion className="w-6 h-6 text-[#329D9C] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#205072]">{quiz.questions.length}</p>
                  <p className="text-xs text-slate-500">Questions</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <Clock className="w-6 h-6 text-[#329D9C] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#205072]">{quiz.duration}</p>
                  <p className="text-xs text-slate-500">Minutes</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-[#329D9C] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#205072]">{quiz.passingScore}%</p>
                  <p className="text-xs text-slate-500">To Pass</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">How it works</p>
                    <ul className="text-sm text-amber-700 mt-1 space-y-1">
                      <li>• Click on your answer - it will auto-advance</li>
                      <li>• Correct answers show green feedback</li>
                      <li>• Wrong answers show the correct answer in red</li>
                      <li>• Score is shown automatically after the last question</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleStartQuiz}
                className="w-full gap-2 h-12 text-lg bg-gradient-to-r from-[#329D9C] to-[#56C596] hover:from-[#205072] hover:to-[#329D9C] text-white"
              >
                Start Quiz
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const hasAnswered = answerResults.some(r => r.questionIndex === currentQuestion)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596]">
      <header className="bg-[#205072]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">{quiz.title}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              timeLeft < 60 ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-white/70 text-sm">
              {answerResults.length} answered
            </span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-[#329D9C]/10 text-[#329D9C] text-xs font-medium rounded">
                {question.type === "true_false" ? "True/False" : "Multiple Choice"}
              </span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                {question.points} point{question.points > 1 ? "s" : ""}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-[#205072] mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                let optionStyle = "border-slate-200 hover:border-[#329D9C]/50 cursor-pointer"
                
                if (showingFeedback && currentFeedback) {
                  if (idx === currentFeedback.correctAnswer) {
                    optionStyle = "border-emerald-500 bg-emerald-100"
                  } else if (idx === answerResults[answerResults.length - 1]?.selectedAnswer && !currentFeedback.isCorrect) {
                    optionStyle = "border-red-500 bg-red-100"
                  } else {
                    optionStyle = "border-slate-200 opacity-50"
                  }
                }
                
                return (
                  <div
                    key={idx}
                    onClick={() => !showingFeedback && !hasAnswered && handleSelectAnswer(idx)}
                    className={`p-4 rounded-xl border-2 transition-all ${optionStyle} ${
                      showingFeedback || hasAnswered ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-medium ${
                        showingFeedback && idx === currentFeedback?.correctAnswer
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : showingFeedback && idx === answerResults[answerResults.length - 1]?.selectedAnswer && !currentFeedback?.isCorrect
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-slate-300 text-slate-600"
                      }`}>
                        {showingFeedback && idx === currentFeedback?.correctAnswer ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : showingFeedback && idx === answerResults[answerResults.length - 1]?.selectedAnswer && !currentFeedback?.isCorrect ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </div>
                      <span className={`${
                        showingFeedback && idx === currentFeedback?.correctAnswer
                          ? "text-emerald-700 font-medium"
                          : showingFeedback && idx === answerResults[answerResults.length - 1]?.selectedAnswer && !currentFeedback?.isCorrect
                            ? "text-red-700 line-through"
                            : "text-[#205072]"
                      }`}>
                        {option}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {showingFeedback && currentFeedback && (
              <div className={`mt-6 p-4 rounded-xl text-center ${
                currentFeedback.isCorrect 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {currentFeedback.isCorrect ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Correct! Moving to next question...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Wrong! The correct answer is highlighted above.</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {quiz.questions.map((_, idx) => {
            const answered = answerResults.find(a => a.questionIndex === idx)
            return (
              <div
                key={idx}
                className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center ${
                  idx === currentQuestion
                    ? "bg-white text-[#205072]"
                    : answered
                      ? answered.isCorrect
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-white/20 text-white"
                }`}
              >
                {answered ? (
                  answered.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )
                ) : (
                  idx + 1
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
