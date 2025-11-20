import { motion } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import { Volume2, CheckCircle2, XCircle, Lightbulb, ArrowRight, Sparkles, Trophy, AlertCircle } from 'lucide-react';

import LadrãoFeliz from './Ladrao_feliz.png';
import LadrãoTriste from './Ladrao_triste.png';

interface ResultProps {
  isCorrect: boolean | null;
  tip: string;
  nextQuestion: () => void;
}

const Result = ({ isCorrect, tip, nextQuestion }: ResultProps) => {
  const { playAudio, isSpeaking } = useSpeech();

  const resultConfig = isCorrect
    ? {
        bgGradient: 'from-green-100 via-emerald-50 to-green-50',
        cardBg: 'bg-white',
        iconBg: 'from-green-400 to-emerald-500',
        iconColor: 'text-green-600',
        textColor: 'text-green-800',
        borderColor: 'border-green-300',
        buttonGradient: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
        icon: CheckCircle2,
        message: 'Resposta correta!',
        subMessage: 'Parabéns! Você está aprendendo a se proteger!',
        emoji: '🎉',
        badgeColor: 'bg-green-100 text-green-800 border-green-300'
      }
    : {
        bgGradient: 'from-red-100 via-rose-50 to-red-50',
        cardBg: 'bg-white',
        iconBg: 'from-red-400 to-rose-500',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
        borderColor: 'border-red-300',
        buttonGradient: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
        icon: XCircle,
        message: 'Resposta incorreta!',
        subMessage: 'Não desanime! Continue aprendendo!',
        emoji: '💪',
        badgeColor: 'bg-red-100 text-red-800 border-red-300'
      };

  const IconComponent = resultConfig.icon;

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`${resultConfig.cardBg} rounded-3xl shadow-2xl p-10 md:p-14 max-w-7xl w-full relative overflow-hidden border-8 ${
          isCorrect ? 'border-green-300' : 'border-red-300'
        }`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-100/30 to-yellow-100/30 rounded-full blur-3xl -ml-48 -mb-48" />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Image and Status */}
            <div className="flex flex-col items-center">
              {/* Image Section */}
              <motion.div
                className="mb-6"
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              >
                <div className="inline-block p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-xl border-4 border-gray-200">
                  <img
                    src={isCorrect ? LadrãoTriste : LadrãoFeliz}
                    alt={isCorrect ? "Ladrão triste" : "Ladrão feliz"}
                    className="w-72 h-72 md:w-80 md:h-80 object-contain mx-auto"
                  />
                </div>
              </motion.div>

              {/* Status Badge */}
              <motion.div
                className={`flex items-center gap-3 px-6 py-3 rounded-full ${resultConfig.badgeColor} border-2 ${resultConfig.borderColor} shadow-lg mb-4 justify-center`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className={`p-2 rounded-full bg-gradient-to-br ${resultConfig.iconBg} shadow-md flex-shrink-0`}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-center">
                  <h2 className={`text-2xl md:text-3xl font-bold ${resultConfig.textColor}`}>
                    {resultConfig.message}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {resultConfig.subMessage}
                  </p>
                </div>
                <span className="text-3xl flex-shrink-0">{resultConfig.emoji}</span>
              </motion.div>
            </div>

            {/* Right Column - Tip Card */}
            <div>
              <motion.div
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Tip Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      DICA
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Aprenda mais sobre este golpe</p>
                  </div>
                </div>

                {/* Tip Content */}
                <div className="mb-6">
                  <p className="text-gray-800 text-base md:text-lg leading-relaxed font-medium">
                    {tip}
                  </p>
                </div>

                {/* Audio Button */}
                <motion.button
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-semibold ${
                    isSpeaking
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-300 shadow-md'
                  }`}
                  onClick={() => playAudio(tip)}
                  title={isSpeaking ? "Parar áudio" : "Ouvir dica"}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Volume2 className="w-5 h-5" />
                  <span>{isSpeaking ? 'Parar áudio' : 'Ouvir dica'}</span>
                </motion.button>
              </motion.div>

              {/* Next Question Button */}
              <motion.button
                className={`w-full mt-6 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${resultConfig.buttonGradient} text-white rounded-xl font-bold text-lg shadow-xl transition-all`}
                onClick={nextQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -3, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Próxima pergunta</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
};

export default Result;
