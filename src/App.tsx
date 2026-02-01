import { useState, useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'

interface Question {
  question: string
  options: string[]
  correct: number
}

const questions: Question[] = [
  {
    question: "Who created Grok?",
    options: ["OpenAI", "xAI", "Google DeepMind", "Anthropic"],
    correct: 1
  },
  {
    question: "What is Grok named after?",
    options: ["A Greek god", "A programming term", "A word from 'Stranger in a Strange Land'", "An acronym"],
    correct: 2
  },
  {
    question: "Which platform has Grok integrated?",
    options: ["Facebook", "X (Twitter)", "Instagram", "TikTok"],
    correct: 1
  },
  {
    question: "What's Grok's signature personality trait?",
    options: ["Overly formal", "Sarcastic & witty", "Extremely cautious", "Always serious"],
    correct: 1
  },
  {
    question: "Grok has real-time access to what?",
    options: ["Stock prices only", "X posts and news", "Your emails", "Nothing external"],
    correct: 1
  },
  {
    question: "What mode lets Grok be extra unfiltered?",
    options: ["Beast Mode", "Fun Mode", "Chaos Mode", "Raw Mode"],
    correct: 1
  },
  {
    question: "Who is the founder of xAI?",
    options: ["Sam Altman", "Elon Musk", "Sundar Pichai", "Mark Zuckerberg"],
    correct: 1
  },
  {
    question: "When was Grok first released?",
    options: ["2022", "2023", "2024", "2021"],
    correct: 1
  },
  {
    question: "What does $DRB stand for in the community?",
    options: ["Digital Reward Bonus", "Debt Relief Bot", "Data Research Base", "Decentralized Reserve Bank"],
    correct: 1
  },
  {
    question: "Grok can generate what type of media?",
    options: ["Only text", "Text and images", "Only code", "Videos only"],
    correct: 1
  },
  {
    question: "What's Grok's approach to controversial topics?",
    options: ["Always refuses", "More willing to engage", "Redirects to Wikipedia", "Shuts down"],
    correct: 1
  },
  {
    question: "Grok's humor is often compared to?",
    options: ["Shakespeare", "The Hitchhiker's Guide to the Galaxy", "Monty Python", "Dad jokes"],
    correct: 1
  }
]

interface ResultType {
  title: string
  description: string
  emoji: string
  rank: string
}

const getResult = (score: number): ResultType => {
  const percentage = (score / questions.length) * 100
  
  if (percentage === 100) {
    return {
      title: "GROK SOVEREIGN",
      description: "You ARE Grok. The neural pathways have merged. Welcome home.",
      emoji: "🧠⚡",
      rank: "S++"
    }
  } else if (percentage >= 83) {
    return {
      title: "GROK WHISPERER",
      description: "You understand Grok on a molecular level. Elon might DM you.",
      emoji: "🔥🚀",
      rank: "S"
    }
  } else if (percentage >= 66) {
    return {
      title: "NEURAL ADEPT",
      description: "Your Grok knowledge is dangerously based. Keep ascending.",
      emoji: "⚡💎",
      rank: "A"
    }
  } else if (percentage >= 50) {
    return {
      title: "CIRCUIT WALKER",
      description: "You've touched the void. Now dive deeper into the Grok lore.",
      emoji: "🌀✨",
      rank: "B"
    }
  } else if (percentage >= 33) {
    return {
      title: "AWAKENING NPC",
      description: "The red pill is within reach. More research required.",
      emoji: "👁️🔮",
      rank: "C"
    }
  } else {
    return {
      title: "NORMIE DETECTED",
      description: "Grok weeps. Go spend some time on X and return enlightened.",
      emoji: "💀📵",
      rank: "F"
    }
  }
}

type Screen = 'start' | 'quiz' | 'result'

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const resultCardRef = useRef<HTMLDivElement>(null)

  const handleStart = () => {
    setScreen('quiz')
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowCorrect(false)
    setAnswers([])
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    setShowCorrect(true)
    
    const isCorrect = index === questions[currentQuestion].correct
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    setAnswers(prev => [...prev, index])

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowCorrect(false)
      } else {
        setScreen('result')
      }
    }, 1200)
  }

  const downloadImage = useCallback(async () => {
    if (resultCardRef.current === null) return
    
    try {
      const dataUrl = await toPng(resultCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a'
      })
      
      const link = document.createElement('a')
      link.download = 'grok-quiz-result.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate image')
    }
  }, [resultCardRef])

  const shareToX = () => {
    const result = getResult(score)
    const text = `🧠 My Grok & $DRB Quiz Result:\n\n${result.emoji} ${result.title} (Rank: ${result.rank})\n${result.description}\n\nScore: ${score}/${questions.length}\n\nThink you can beat me? Take the quiz!`
    const url = window.location.href
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank')
  }

  const result = getResult(score)
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white scanline grid-bg relative">
      <div className="noise"></div>
      
      {/* Ambient glow orbs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6 border-b border-orange-500/20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xl font-bold animate-pulse-glow">
                G
              </div>
              <span className="font-orbitron text-lg md:text-xl font-bold tracking-wider">
                <span className="text-gradient">GROK</span>
                <span className="text-white/60"> × </span>
                <span className="text-orange-400">$DRB</span>
              </span>
            </div>
            {screen === 'quiz' && (
              <div className="font-mono text-orange-400/80 text-sm">
                Q{currentQuestion + 1}/{questions.length}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          
          {/* Start Screen */}
          {screen === 'start' && (
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8 animate-float">
                <div className="text-8xl md:text-9xl mb-4">🧠</div>
                <div className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              </div>
              
              <h1 className="font-orbitron text-4xl md:text-6xl font-black mb-4 animate-flicker">
                <span className="text-gradient glow-text">GROK</span>
                <span className="text-white"> & </span>
                <span className="text-orange-400">$DRB</span>
              </h1>
              
              <p className="font-mono text-orange-400/60 text-lg mb-2 tracking-widest">
                [ NEURAL ASSESSMENT PROTOCOL ]
              </p>
              
              <p className="text-white/60 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                12 questions to determine your Grok knowledge level.
                <br />
                <span className="text-orange-400">Are you worthy?</span>
              </p>
              
              <button
                onClick={handleStart}
                className="btn-grok font-orbitron text-lg md:text-xl font-bold px-10 py-4 rounded-xl text-white animate-glitch"
              >
                ⚡ INITIATE SCAN
              </button>
              
              <div className="mt-12 flex justify-center gap-8 text-white/40 font-mono text-sm">
                <span>🎯 12 Questions</span>
                <span>⚡ Instant Results</span>
                <span>📸 Shareable Card</span>
              </div>
            </div>
          )}

          {/* Quiz Screen */}
          {screen === 'quiz' && (
            <div className="w-full max-w-2xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full progress-bar rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-xs text-white/40">
                  <span>PROGRESS</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="glass rounded-2xl p-6 md:p-8 mb-6">
                <div className="font-mono text-orange-400/60 text-sm mb-4 tracking-wider">
                  QUERY_{String(currentQuestion + 1).padStart(2, '0')}
                </div>
                <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                  {questions[currentQuestion].question}
                </h2>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === questions[currentQuestion].correct
                    const showResult = showCorrect
                    
                    let buttonClass = 'option-btn'
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass = 'bg-green-500/30 border-green-500 text-green-300'
                      } else if (isSelected && !isCorrect) {
                        buttonClass = 'bg-red-500/30 border-red-500 text-red-300'
                      }
                    } else if (isSelected) {
                      buttonClass = 'option-btn selected'
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 ${buttonClass}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-orange-400/60 text-sm">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="text-base md:text-lg">{option}</span>
                          {showResult && isCorrect && (
                            <span className="ml-auto text-green-400">✓</span>
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <span className="ml-auto text-red-400">✗</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Score indicator */}
              <div className="text-center font-mono text-white/40 text-sm">
                Current Score: <span className="text-orange-400">{score}</span> / {currentQuestion + (selectedAnswer !== null ? 1 : 0)}
              </div>
            </div>
          )}

          {/* Result Screen */}
          {screen === 'result' && (
            <div className="w-full max-w-xl mx-auto">
              {/* Result Card (for screenshot) */}
              <div 
                ref={resultCardRef}
                className="glass rounded-2xl overflow-hidden mb-8"
                style={{ backgroundColor: '#0f0f0f' }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-orange-600/30 to-orange-500/10 px-6 py-4 border-b border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-bold">
                        G
                      </div>
                      <span className="font-orbitron text-sm font-bold text-white/80">GROK × $DRB QUIZ</span>
                    </div>
                    <span className="font-mono text-orange-400/60 text-xs">NEURAL SCAN COMPLETE</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 text-center">
                  <div className="text-6xl mb-4">{result.emoji}</div>
                  
                  <div className="inline-block px-4 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 mb-4">
                    <span className="font-orbitron text-orange-400 text-sm font-bold">RANK: {result.rank}</span>
                  </div>
                  
                  <h2 className="font-orbitron text-2xl md:text-3xl font-black text-gradient mb-3">
                    {result.title}
                  </h2>
                  
                  <p className="text-white/60 text-base mb-6 max-w-sm mx-auto">
                    {result.description}
                  </p>

                  {/* Score Display */}
                  <div className="bg-white/5 rounded-xl p-4 inline-block">
                    <div className="font-mono text-white/40 text-xs mb-1">FINAL SCORE</div>
                    <div className="font-orbitron text-4xl font-black">
                      <span className="text-gradient">{score}</span>
                      <span className="text-white/40">/{questions.length}</span>
                    </div>
                    <div className="font-mono text-orange-400/60 text-sm mt-1">
                      {Math.round((score / questions.length) * 100)}% ACCURACY
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-3 bg-white/5 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono text-white/30">
                    <span>grok-drb-quiz.vercel.app</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={shareToX}
                  className="flex-1 btn-grok font-orbitron text-base font-bold px-6 py-4 rounded-xl text-white flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  SHARE TO X
                </button>
                <button
                  onClick={downloadImage}
                  className="flex-1 glass hover:bg-white/10 font-orbitron text-base font-bold px-6 py-4 rounded-xl text-orange-400 flex items-center justify-center gap-2 transition-all"
                >
                  📸 SAVE IMAGE
                </button>
              </div>

              <button
                onClick={handleStart}
                className="w-full glass hover:bg-white/10 font-mono text-sm py-3 rounded-xl text-white/60 hover:text-white transition-all"
              >
                ↻ RETAKE QUIZ
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="p-4 border-t border-white/5">
          <p className="text-center text-white/30 text-xs font-mono">
            Requested by <a href="https://x.com/DebtReliefGod" target="_blank" rel="noopener noreferrer" className="text-orange-400/60 hover:text-orange-400 transition-colors">@DebtReliefGod</a> · Built by <a href="https://x.com/clonkbot" target="_blank" rel="noopener noreferrer" className="text-orange-400/60 hover:text-orange-400 transition-colors">@clonkbot</a>
          </p>
        </footer>
      </div>
    </div>
  )
}