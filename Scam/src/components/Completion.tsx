import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Award } from 'lucide-react';
import { buttonClass } from '../styles/common';

interface CompletionProps {
  score: number;
  total: number;
  setStep: (step: string) => void;
  resetQuiz: () => void;
  resetAll: () => void;
  goToProfile?: () => void;
}

const Completion = ({ score, total, setStep, resetQuiz, resetAll, goToProfile }: CompletionProps) => {
  const percentage = Math.round((score / total) * 100);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let message = "";
  if (percentage === 100) {
    message = "Excelente! Você está bem preparado contra golpes online!";
  } else if (percentage >= 70) {
    message = "Muito bom! Você já sabe bastante sobre segurança online.";
  } else if (percentage >= 50) {
    message = "Bom trabalho! Continue aprendendo para se proteger melhor.";
  } else {
    message = "Continue praticando para melhorar sua segurança online.";
  }

  return (
    <>
      {percentage >= 50 && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={250}
          recycle={false}
        />
      )}

      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotateY: [0, 360] }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4"
        >
          <Award className="w-24 h-24 mx-auto text-yellow-500" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Parabéns!</h2>
        <p className="mb-4 text-gray-700">Você concluiu o Scam - Simulador Educativo Anti-Golpes.</p>
        
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-medium">Sua pontuação:</span>
            <span className="text-purple-700 font-bold">{score}/{total}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <motion.div 
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        </div>
        
        <div className="flex gap-3 justify-center flex-wrap">
          {goToProfile ? (
            <motion.button 
              className={`${buttonClass} bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={goToProfile}
            >
              Ver Meu Perfil
            </motion.button>
          ) : (
            <motion.button 
              className={`${buttonClass} bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetQuiz}
            >
              Continuar
            </motion.button>
          )}
          
          <motion.button 
            className={`${buttonClass} bg-green-600 hover:bg-green-700 text-white flex items-center justify-center`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetQuiz}
          >
            Iniciar Nova Partida
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Completion;
