import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { QuestionType } from '../data/questions';
import { buttonClass } from '../styles/common';
import { useSpeech } from '../hooks/useSpeech';
import { getQuestionStats, QuestionStats } from '../services/questionStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { interestsList } from '../data/interests';

interface QuizProps {
  currentQuestion: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  setStep: (step: string) => void;
  isAdmin?: boolean;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  isLoggedIn?: boolean;
  onGoToProfile?: () => void;
  selectedInterestFilter?: string;
  onInterestFilterChange?: (interest: string) => void;
}

const Quiz = ({ 
  currentQuestion, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  setStep, 
  isAdmin = false,
  onPreviousQuestion,
  onNextQuestion,
  isLoggedIn = false,
  onGoToProfile,
  selectedInterestFilter,
  onInterestFilterChange
}: QuizProps) => {
  const { playAudio, isSpeaking } = useSpeech();
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null);

  // Carregar estatísticas da pergunta se for admin
  useEffect(() => {
    if (isAdmin && currentQuestion) {
      const stats = getQuestionStats(currentQuestion.question);
      setQuestionStats(stats);
    } else {
      setQuestionStats(null);
    }
  }, [currentQuestion?.question, isAdmin]);

  // Preparar dados para gráfico de barras
  const barChartData = questionStats
    ? currentQuestion.options.map((opt) => ({
        option: opt.label,
        count: questionStats.answersByOption[opt.label] || 0,
      }))
    : [];

  // Preparar dados para gráfico de pizza
  const pieChartData = questionStats
    ? [
        { name: 'Acertos', value: questionStats.correctAnswers, color: '#10b981' },
        { name: 'Erros', value: questionStats.incorrectAnswers, color: '#ef4444' },
      ]
    : [];

  const textoParaLer =
    `${currentQuestion.question}. ` +
    currentQuestion.options.map(opt => `${opt.label}: ${opt.text}`).join('. ');

  return (
    <>
      <motion.div 
        className={`bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 ${isAdmin ? 'max-w-7xl w-full' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Filtro por Interesse para Admin */}
        {isAdmin && onInterestFilterChange && (
          <div className="mb-4 pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Interesse
            </label>
            <select
              value={selectedInterestFilter || 'all'}
              onChange={(e) => onInterestFilterChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="all">Todos os Interesses</option>
              {interestsList.map((interest) => (
                <option key={interest.name} value={interest.name}>
                  {interest.name}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Mostrando {totalQuestions} {totalQuestions === 1 ? 'questão' : 'questões'}
              {selectedInterestFilter && selectedInterestFilter !== 'all' && (
                <span> relacionadas a "{selectedInterestFilter}"</span>
              )}
            </div>
          </div>
        )}

        {/* Barra de progresso */}
        <div className="flex justify-between items-center mb-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} 
            />
          </div>
          <span className="text-sm font-medium text-gray-600 ml-3 whitespace-nowrap">
            {questionNumber}/{totalQuestions}
          </span>
        </div>

        {/* Layout: Pergunta à esquerda, Estatísticas à direita (apenas para admin) */}
        <div className={isAdmin ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}>
          {/* Coluna da Pergunta */}
          <div className={isAdmin ? 'flex flex-col' : ''}>
            {/* Pergunta e botão de áudio */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {currentQuestion.question}
              </h2>
              <motion.button
                className={`p-2 rounded-full transition-colors ${
                  isSpeaking 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-500 hover:bg-blue-100'
                }`}
                onClick={() => playAudio(textoParaLer)}
                title={isSpeaking ? "Parar áudio" : "Ouvir pergunta e alternativas"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Volume2 size={20} />
              </motion.button>
            </div>

            {/* Alternativas */}
            <div className="flex flex-col gap-3 mt-2">
              {currentQuestion.options.map((opt, index) => {
                const isCorrect = opt.label === currentQuestion.correct;
                const isCorrectOption = isAdmin && isCorrect;
                
                return (
                  <motion.button 
                    key={opt.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`${buttonClass} text-left flex items-start ${
                      isCorrectOption
                        ? 'bg-green-600 hover:bg-green-700 border-2 border-green-800'
                        : 'hover:bg-blue-600 bg-blue-500'
                    } text-white ${isAdmin ? 'cursor-default' : ''}`}
                    onClick={() => {
                      if (!isAdmin) {
                        onAnswer(opt.label);
                      }
                    }}
                    whileHover={!isAdmin ? { scale: 1.02 } : {}}
                    whileTap={!isAdmin ? { scale: 0.98 } : {}}
                    disabled={isAdmin}
                  >
                    <span className={`inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full font-bold text-sm mt-0.5 ${
                      isCorrectOption
                        ? 'bg-green-800 text-white'
                        : 'bg-white text-blue-600'
                    }`}>
                      {opt.label}
                    </span>
                    <span className="text-left">{opt.text}</span>
                    {isCorrectOption && (
                      <span className="ml-auto text-green-200 font-semibold text-xs">✓ Correta</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Dica/Tip - Apenas para admin */}
            {isAdmin && currentQuestion.tip && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Por que esta é a resposta correta?</h4>
                <p className="text-sm text-blue-900 leading-relaxed">{currentQuestion.tip}</p>
              </div>
            )}
          </div>

          {/* Coluna das Estatísticas para Admin */}
          {isAdmin && (
            <div className="border-l border-gray-300 pl-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas da Pergunta</h3>
              
              {questionStats && questionStats.totalAnswers > 0 ? (
                <div className="space-y-4">
                  {/* Gráfico de Barras - Respostas por Alternativa */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Respostas por Alternativa ({questionStats.totalAnswers} respostas totais)
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="option" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Gráfico de Pizza - Acertos vs Erros */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Distribuição de Acertos e Erros
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-800">
                    Ainda não há estatísticas para esta pergunta. As estatísticas aparecerão quando usuários responderem.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botões de Navegação para Admin */}
        {isAdmin && onPreviousQuestion && onNextQuestion && (
          <div className="flex justify-between items-center gap-4 mt-4 pt-4 border-t">
            <motion.button
              onClick={onPreviousQuestion}
              disabled={questionNumber === 1}
              className={`${buttonClass} flex items-center gap-2 ${
                questionNumber === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              whileHover={questionNumber === 1 ? {} : { scale: 1.02 }}
              whileTap={questionNumber === 1 ? {} : { scale: 0.98 }}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </motion.button>
            
            <span className="text-sm font-medium text-gray-600">
              Pergunta {questionNumber} de {totalQuestions}
            </span>
            
            <motion.button
              onClick={onNextQuestion}
              disabled={questionNumber === totalQuestions}
              className={`${buttonClass} flex items-center gap-2 ${
                questionNumber === totalQuestions
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              whileHover={questionNumber === totalQuestions ? {} : { scale: 1.02 }}
              whileTap={questionNumber === totalQuestions ? {} : { scale: 0.98 }}
            >
              Próxima
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        )}

        {/* Botão de voltar */}
        <motion.button
          className={`${buttonClass} bg-gray-200 hover:bg-gray-300 text-gray-800 mt-4`}
          onClick={() => {
            if (isLoggedIn && onGoToProfile) {
              onGoToProfile();
            } else {
              setShowConfirmExit(true);
            }
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoggedIn ? 'Voltar ao Perfil' : 'Voltar à tela inicial'}
        </motion.button>
      </motion.div>

      {/* Modal de confirmação */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {isLoggedIn ? 'Deseja voltar ao perfil?' : 'Deseja voltar à tela inicial?'}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {isLoggedIn ? 'Você perderá o progresso do quiz atual.' : 'Seu progresso será perdido.'}
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className={`${buttonClass} bg-gray-300 hover:bg-gray-400 text-gray-800`}
                onClick={() => setShowConfirmExit(false)}
              >
                Cancelar
              </button>
              <button
                className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white`}
                onClick={() => {
                  if (isLoggedIn && onGoToProfile) {
                    onGoToProfile();
                  } else {
                    setStep('welcome');
                  }
                }}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Quiz;
