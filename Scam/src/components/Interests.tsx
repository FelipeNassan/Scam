import { motion } from 'framer-motion';
import { StepType } from '../features/SimuladorAntiGolpes';
import { buttonClass } from '../styles/common';
import { useState } from 'react';
import { userApi } from '../services/api';
import { interestsList } from '../data/interests';

interface InterestsProps {
  setStep: (step: StepType) => void;
}

const Interests = ({ setStep }: InterestsProps) => {
  // Carrega interesses salvos do localStorage ao montar
  const loadSavedInterests = (): string[] => {
    try {
      const saved = localStorage.getItem('userInterests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [selectedInterests, setSelectedInterests] = useState<string[]>(loadSavedInterests);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(item => item !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleContinue = async () => {
    // Salva os interesses selecionados no localStorage (para uso imediato)
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    
    // Tenta salvar no banco de dados se houver userId temporário (cadastro novo)
    const tempUserId = localStorage.getItem('tempUserId');
    if (tempUserId) {
      try {
        const userId = parseInt(tempUserId, 10);
        const interestsJson = JSON.stringify(selectedInterests);
        await userApi.updateUser(userId, { interests: interestsJson });
        // Remove o userId temporário após salvar
        localStorage.removeItem('tempUserId');
      } catch (error) {
        console.error('Erro ao salvar interesses no banco:', error);
        // Continua mesmo se der erro, pois já salvou no localStorage
      }
    }
    
    setStep('quiz');
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 text-center"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Escolha seus interesses</h2>
      <p className="text-gray-600 mb-4">Selecione os tópicos que mais interessam você</p>
      
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {interestsList.map((item, index) => (
          <motion.button
            key={item.name}
            title={item.description}
            onClick={() => toggleInterest(item.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedInterests.includes(item.name) 
                ? 'bg-blue-500 text-white' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {item.name}
          </motion.button>
        ))}

      </div>
      
      <div className="flex gap-3">
        <motion.button 
          className={`${buttonClass} flex-1 bg-gray-400 hover:bg-gray-500`} 
          onClick={() => setStep('register')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Voltar
        </motion.button>
        
        <motion.button 
          className={`${buttonClass} flex-1 bg-blue-600 hover:bg-blue-700 text-white`} 
          onClick={handleContinue}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Interests;