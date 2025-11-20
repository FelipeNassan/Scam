import { motion } from 'framer-motion';
import { StepType } from '../features/SimuladorAntiGolpes';
import { useState } from 'react';
import { userApi } from '../services/api';
import { interestsList } from '../data/interests';
import { Heart, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface InterestsProps {
  setStep: (step: StepType) => void;
}

const Interests = ({ setStep }: InterestsProps) => {
  // Carrega interesses salvos do localStorage ao montar
  // Mas se houver tempUserId (novo registro), começa vazio
  const loadSavedInterests = (): string[] => {
    // Se há tempUserId, é um novo registro - não carrega interesses antigos
    const tempUserId = localStorage.getItem('tempUserId');
    if (tempUserId) {
      return [];
    }
    
    try {
      const saved = localStorage.getItem('userInterests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [selectedInterests, setSelectedInterests] = useState<string[]>(loadSavedInterests);
  const [error, setError] = useState<string>('');

  const toggleInterest = (interest: string) => {
    setError(''); // Limpa erro ao selecionar
    if (interest === 'Todos') {
      // Se "Todos" for clicado, limpa a seleção (mostra todas as questões)
      setSelectedInterests([]);
    } else {
      // Remove "Todos" se estiver selecionado e adiciona o interesse específico
      if (selectedInterests.includes(interest)) {
        setSelectedInterests(prev => prev.filter(item => item !== interest));
      } else {
        setSelectedInterests(prev => prev.filter(item => item !== 'Todos').concat(interest));
      }
    }
  };

  const handleContinue = async () => {
    // Validação: se não selecionou "Todos", deve ter pelo menos 3 interesses
    if (selectedInterests.length > 0 && selectedInterests.length < 3) {
      setError('Por favor, selecione pelo menos 3 interesses ou escolha "Todos" para ver todas as questões.');
      return;
    }

    setError(''); // Limpa erro se validação passou
    
    // Salva os interesses selecionados no localStorage (para uso imediato)
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    
    // Tenta salvar no banco de dados se houver userId temporário (cadastro novo)
    const tempUserId = localStorage.getItem('tempUserId');
    if (tempUserId) {
      try {
        const userId = parseInt(tempUserId, 10);
        const interestsJson = JSON.stringify(selectedInterests);
        
        // Busca os dados do usuário para salvar no currentUser
        const user = await userApi.getUserById(userId);
        if (user) {
          // Atualiza interesses no banco
          await userApi.updateUser(userId, { interests: interestsJson });
          
          // Salva o usuário completo no currentUser para manter o estado de login
          localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            score: user.score || 0
          }));
        }
        
        // Remove o userId temporário após salvar
        localStorage.removeItem('tempUserId');
      } catch (error) {
        console.error('Erro ao salvar interesses no banco:', error);
        // Continua mesmo se der erro, pois já salvou no localStorage
      }
    }
    
    setStep('quiz');
  };

  const selectedCount = selectedInterests.length;

  return (
    <motion.div 
      className="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-2xl shadow-2xl p-8"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="flex justify-center mb-4"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <div className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg">
            <Heart className="text-white w-12 h-12" />
          </div>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Escolha seus interesses
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Selecione pelo menos 3 interesses específicos para ver questões relacionadas, ou clique em "Todos" para ver todas as questões
        </p>
      </motion.div>

      {/* Contador de selecionados */}
      {selectedCount > 0 && selectedCount < 3 && (
        <motion.div 
          className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-center gap-2 text-yellow-800">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {selectedCount} de 3 interesses selecionados
            </span>
          </div>
        </motion.div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <motion.div 
          className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-red-600">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        </motion.div>
      )}
      
      {/* Grid de Interesses */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {/* Botão "Todos" - aparece primeiro e destacado */}
        <motion.button
          key="Todos"
          title="Mostrar questões de todos os interesses"
          onClick={() => toggleInterest('Todos')}
          className={`px-6 py-3 rounded-xl text-base font-bold transition-all shadow-md ${
            selectedInterests.length === 0
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-700 shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          {selectedInterests.length === 0 && (
            <CheckCircle2 className="w-5 h-5 inline-block mr-2" />
          )}
          Todos
        </motion.button>
        
        {interestsList.map((item, index) => (
          <motion.button
            key={item.name}
            title={item.description}
            onClick={() => toggleInterest(item.name)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              selectedInterests.includes(item.name) 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-2 border-blue-700 shadow-md' 
                : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-200'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index + 1) * 0.02 }}
          >
            {selectedInterests.includes(item.name) && (
              <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
            )}
            {item.name}
          </motion.button>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4">
        <motion.button 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all shadow-md" 
          onClick={() => setStep('register')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02, x: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </motion.button>
        
        <motion.button 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all" 
          onClick={handleContinue}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
          <Sparkles className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Interests;
