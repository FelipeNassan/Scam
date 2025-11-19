import { motion } from 'framer-motion';
import { buttonClass } from '../styles/common';
import { useSpeech } from '../hooks/useSpeech';

import LadrãoFeliz from './Ladrao_feliz.png';
import LadrãoTriste from './Ladrao_triste.png';

interface ResultProps {
  isCorrect: boolean | null;
  tip: string;
  nextQuestion: () => void;
}

const Result = ({ isCorrect, tip, nextQuestion }: ResultProps) => {
  const { playAudio, isSpeaking } = useSpeech();

  return (
    <motion.div 
      className={`text-center p-6 rounded-lg shadow-lg ${
        isCorrect ? "bg-green-100" : "bg-red-100"
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-4"
      >
        <img
          src={isCorrect ? LadrãoTriste : LadrãoFeliz }
          alt={isCorrect ? "Ladrão triste" : "Ladrão feliz" }
          className="w-21 h-21 mx-auto"
        />
      </motion.div>

      <h2 className="text-xl font-bold mb-3">
        {isCorrect ? "Resposta correta!" : "Resposta incorreta!"}
      </h2>
      
      <div className="bg-white p-4 rounded-md mb-4 relative">
        <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
          DICA
        </div>
        <p className="text-gray-700">{tip}</p>
        <motion.button
          className={`p-1 rounded-full transition-colors mt-2 text-sm inline-flex items-center ${
            isSpeaking 
              ? 'bg-blue-500 text-white' 
              : 'text-blue-500 hover:bg-blue-50'
          }`}
          onClick={() => playAudio(tip)}
          title={isSpeaking ? "Parar áudio" : "Ouvir dica"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="ml-1">{isSpeaking ? 'Parar' : 'Ouvir'}</span>
        </motion.button>
      </div>

      <motion.button 
        className={`${buttonClass} ${isCorrect ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} mt-2`} 
        onClick={nextQuestion}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Próxima pergunta
      </motion.button>
    </motion.div>
  );
};

export default Result;
