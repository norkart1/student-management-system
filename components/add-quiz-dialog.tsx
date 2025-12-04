"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  FileQuestion,
  Plus,
  Trash2,
  Check,
  Clock,
  Target,
  Globe,
  Calendar
} from "lucide-react"

interface Question {
  question: string
  type: "multiple_choice" | "true_false"
  options: string[]
  correctAnswer: number
  points: number
}

interface QuizData {
  _id?: string
  title: string
  description: string
  duration: number
  passingScore: number
  isPublic?: boolean
  scheduledCloseTime?: string
  questions: Question[]
}

interface AddQuizDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
  editData?: QuizData | null
}

export function AddQuizDialog({ open, onOpenChange, onSave, editData }: AddQuizDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    passingScore: 50,
    isPublic: false,
    scheduledCloseTime: "",
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    type: "multiple_choice",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  })

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        description: editData.description || "",
        duration: editData.duration || 30,
        passingScore: editData.passingScore || 50,
        isPublic: editData.isPublic || false,
        scheduledCloseTime: editData.scheduledCloseTime || "",
      })
      setQuestions(editData.questions || [])
    } else {
      setFormData({ title: "", description: "", duration: 30, passingScore: 50, isPublic: false, scheduledCloseTime: "" })
      setQuestions([])
    }
    setStep(1)
    setCurrentQuestion({
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    })
  }, [editData, open])

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) return
    
    const filteredOptions = currentQuestion.type === "true_false" 
      ? ["True", "False"]
      : currentQuestion.options.filter(opt => opt.trim())
    
    if (filteredOptions.length < 2) return
    
    setQuestions([...questions, { ...currentQuestion, options: filteredOptions }])
    setCurrentQuestion({
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    })
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!formData.title.trim()) return
    
    onSave({
      ...formData,
      questions,
      status: "draft",
    })
    onOpenChange(false)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-2xl w-[calc(100%-2rem)] mx-auto p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                <FileQuestion className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-slate-800 text-xl font-bold">
                  {editData ? "Edit Quiz" : "Create New Quiz"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-1">
                  {step === 1 ? "Set up quiz details" : "Add questions to your quiz"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-center gap-2 my-6">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-slate-200"}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-slate-200"}`} />
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 font-medium">
                  Quiz Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Chapter 1 Quiz"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the quiz..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-700 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passingScore" className="text-slate-700 font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Passing Score (%)
                  </Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledCloseTime" className="text-slate-700 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Auto-Close Time (Optional)
                </Label>
                <Input
                  id="scheduledCloseTime"
                  type="datetime-local"
                  value={formData.scheduledCloseTime}
                  onChange={(e) => setFormData({ ...formData, scheduledCloseTime: e.target.value })}
                  className="h-11"
                />
                <p className="text-xs text-slate-500">Quiz will automatically close at this time</p>
              </div>

              <div 
                className="p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer"
                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="isPublic" className="text-slate-800 font-medium cursor-pointer block">
                      Public Quiz
                    </Label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Allow anyone to participate without login
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">
                    Added Questions ({questions.length})
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {questions.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="text-xs text-slate-500">
                            {q.type === "true_false" ? "True/False" : "Multiple Choice"} • {q.points} point(s)
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-4">
                <Label className="text-slate-700 font-medium">Add New Question</Label>
                
                <div className="space-y-2">
                  <Input
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    placeholder="Enter your question..."
                    className="h-11"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={currentQuestion.type === "multiple_choice" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion({ 
                      ...currentQuestion, 
                      type: "multiple_choice",
                      options: ["", "", "", ""],
                      correctAnswer: 0
                    })}
                    className={currentQuestion.type === "multiple_choice" ? "bg-emerald-500" : ""}
                  >
                    Multiple Choice
                  </Button>
                  <Button
                    type="button"
                    variant={currentQuestion.type === "true_false" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion({ 
                      ...currentQuestion, 
                      type: "true_false",
                      options: ["True", "False"],
                      correctAnswer: 0
                    })}
                    className={currentQuestion.type === "true_false" ? "bg-emerald-500" : ""}
                  >
                    True/False
                  </Button>
                </div>

                {currentQuestion.type === "multiple_choice" ? (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 ${
                            currentQuestion.correctAnswer === idx 
                              ? "border-emerald-500 bg-emerald-500" 
                              : "border-slate-300"
                          }`}
                        >
                          {currentQuestion.correctAnswer === idx && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="h-10"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-slate-500">Click the circle to mark the correct answer</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {["True", "False"].map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 ${
                            currentQuestion.correctAnswer === idx 
                              ? "border-emerald-500 bg-emerald-500" 
                              : "border-slate-300"
                          }`}
                        >
                          {currentQuestion.correctAnswer === idx && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-slate-700">{option}</span>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500">Click the circle to mark the correct answer</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Label className="text-slate-700 text-sm">Points:</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })}
                    className="h-9 w-20"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddQuestion}
                  disabled={!currentQuestion.question.trim()}
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 bg-slate-50/80 border-t border-slate-100">
          {step === 2 && (
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 h-11 font-medium rounded-xl"
            >
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button
              onClick={() => setStep(2)}
              disabled={!formData.title.trim()}
              className="flex-1 h-11 font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              Next: Add Questions
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={questions.length === 0}
              className="flex-1 h-11 font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {editData ? "Update Quiz" : "Create Quiz"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
