"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Spinner } from "@/components/spinner"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "sonner"
import {
  FileQuestion,
  Clock,
  Target,
  User,
  Phone,
  MapPin,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Home,
  GraduationCap
} from "lucide-react"

interface Question {
  index: number
  question: string
  type: "multiple_choice" | "true_false"
  options: string[]
  points: number
}

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  passingScore: number
  questionCount: number
  questions: Question[]
}

interface Answer {
  questionIndex: number
  selectedAnswer: number
}

export default function PublicQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [step, setStep] = useState<"register" | "quiz" | "result">("register")
  const [participantData, setParticipantData] = useState({
    name: "",
    phone: "",
    place: "",
    image: ""
  })
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  
  const [result, setResult] = useState<{
    score: number
    totalPoints: number
    percentage: number
    passed: boolean
  } | null>(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (step !== "quiz" || timeRemaining <= 0) return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [step, timeRemaining])

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/public/quizzes/${quizId}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Quiz not found or not available")
        return
      }
      const data = await res.json()
      setQuiz(data)
      setTimeRemaining(data.duration * 60)
    } catch (err) {
      setError("Failed to load quiz")
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = () => {
    if (!participantData.name.trim()) {
      toast.error("Please enter your name")
      return
    }
    if (!participantData.phone.trim()) {
      toast.error("Please enter your phone number")
      return
    }
    if (!participantData.place.trim()) {
      toast.error("Please enter your place")
      return
    }
    setStep("quiz")
  }

  const handleSelectAnswer = (selectedAnswer: number) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionIndex === currentQuestionIndex)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { questionIndex: currentQuestionIndex, selectedAnswer }
        return updated
      }
      return [...prev, { questionIndex: currentQuestionIndex, selectedAnswer }]
    })
  }

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    
    try {
      const res = await fetch("/api/public/quiz-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          participantName: participantData.name,
          participantPhone: participantData.phone,
          participantPlace: participantData.place,
          participantImage: participantData.image,
          answers
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast.error(data.error || "Failed to submit quiz")
        setSubmitting(false)
        return
      }
      
      setResult({
        score: data.score,
        totalPoints: data.totalPoints,
        percentage: data.percentage,
        passed: data.passed
      })
      setStep("result")
    } catch (err) {
      toast.error("Failed to submit quiz")
    } finally {
      setSubmitting(false)
    }
  }, [quizId, participantData, answers, submitting])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionIndex === currentQuestionIndex)?.selectedAnswer
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Spinner message="Loading quiz..." />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800 border-slate-700">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Quiz Not Available</h2>
            <p className="text-slate-400 mb-6">{error || "This quiz is not currently available"}</p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "result" && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800 border-slate-700">
          <CardContent className="pt-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              result.passed ? "bg-emerald-500/20" : "bg-red-500/20"
            }`}>
              {result.passed ? (
                <Trophy className="w-10 h-10 text-emerald-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-400" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {result.passed ? "Congratulations!" : "Quiz Completed"}
            </h2>
            <p className="text-slate-400 mb-6">
              {result.passed ? "You passed the quiz!" : "Keep practicing!"}
            </p>
            
            <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-white mb-2">{result.percentage}%</div>
              <p className="text-slate-400">
                Score: {result.score} / {result.totalPoints} points
              </p>
              <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${
                result.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              }`}>
                {result.passed ? "PASSED" : "NOT PASSED"}
              </div>
            </div>
            
            <div className="text-left bg-slate-700/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-400 mb-1">Participant</p>
              <p className="text-white font-medium">{participantData.name}</p>
              <p className="text-sm text-slate-400">{participantData.phone}</p>
              <p className="text-sm text-slate-400">{participantData.place}</p>
            </div>
            
            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "quiz") {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    const selectedAnswer = getCurrentAnswer()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <FileQuestion className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{quiz.title}</h1>
                <p className="text-xs text-slate-400">Question {currentQuestionIndex + 1} of {quiz.questionCount}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeRemaining < 60 ? "bg-red-500/20 text-red-400" : "bg-slate-700 text-white"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <div className="flex gap-1 mb-6">
            {quiz.questions.map((_, idx) => {
              const isAnswered = answers.some(a => a.questionIndex === idx)
              const isCurrent = idx === currentQuestionIndex
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    isCurrent 
                      ? "bg-amber-500" 
                      : isAnswered 
                        ? "bg-emerald-500" 
                        : "bg-slate-700"
                  }`}
                />
              )
            })}
          </div>
          
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="pt-6">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full mb-4">
                  {currentQuestion.type === "true_false" ? "True/False" : "Multiple Choice"} • {currentQuestion.points} point(s)
                </span>
                <h2 className="text-xl font-semibold text-white">{currentQuestion.question}</h2>
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedAnswer === idx
                        ? "bg-amber-500 text-white border-2 border-amber-400"
                        : "bg-slate-700/50 text-slate-300 border-2 border-transparent hover:bg-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        selectedAnswer === idx ? "bg-white/20" : "bg-slate-600"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {selectedAnswer === idx && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1 h-12 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentQuestionIndex === quiz.questionCount - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questionCount - 1, prev + 1))}
                className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Answered: {answers.length} / {quiz.questionCount}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
            <GraduationCap className="w-6 h-6" />
            <span className="font-semibold">Bright Future Academy</span>
          </Link>
        </div>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileQuestion className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="text-slate-400">{quiz.description}</CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-700/50 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <FileQuestion className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-white">{quiz.questionCount}</div>
                <div className="text-xs text-slate-400">Questions</div>
              </div>
              <div className="text-center border-x border-slate-600">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-white">{quiz.duration}</div>
                <div className="text-xs text-slate-400">Minutes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <Target className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-white">{quiz.passingScore}%</div>
                <div className="text-xs text-slate-400">To Pass</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Enter Your Details</h3>
              
              <div className="flex justify-center">
                <ImageUpload
                  value={participantData.image}
                  onChange={(url) => setParticipantData({ ...participantData, image: url })}
                  label="Your Photo (Optional)"
                  isPublic={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  value={participantData.name}
                  onChange={(e) => setParticipantData({ ...participantData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  value={participantData.phone}
                  onChange={(e) => setParticipantData({ ...participantData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Place *
                </Label>
                <Input
                  value={participantData.place}
                  onChange={(e) => setParticipantData({ ...participantData, place: e.target.value })}
                  placeholder="Enter your city/place"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <Button
              onClick={handleStartQuiz}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
            >
              Start Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-xs text-slate-500 text-center">
              By starting this quiz, you agree that your details will be recorded for result tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
