import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { StepType } from '../features/SimuladorAntiGolpes';
import { buttonClass } from '../styles/common';

interface WelcomeProps {
  setStep: (step: StepType) => void;
}

const Welcome = ({ setStep }: WelcomeProps) => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const newsItems = [
    {
      title: "Mais de 2 milhões de brasileiros foram vítimas de golpes online em 2024",
      subtitle: "Prejuízo médio de R$ 1.200 por vítima",
      color: "red",
    },
    {
      title: "Golpe do falso parente cresce 45% em aplicativos de mensagem",
      subtitle: "Criminosos se passam por familiares pedindo dinheiro urgente",
      color: "orange",
    },
    {
      title: "Venda de produtos inexistentes aumenta 78% em marketplaces",
      subtitle: "Fotos falsas e anúncios enganosos são principais armas dos golpistas",
      color: "yellow",
    },
    {
      title: "Phishing bancário: 1 em cada 3 pessoas já recebeu link suspeito",
      subtitle: "Bancos alertam sobre aumento de tentativas de fraude",
      color: "purple",
    },
    {
      title: "Idosos são principais vítimas: 60% dos golpes atingem pessoas acima de 50 anos",
      subtitle: "Educação digital é fundamental para prevenção",
      color: "blue",
    },
  ];

  const colorClasses = {
    red: {
      bg: "bg-red-50",
      border: "border-red-500",
      dot: "bg-red-500",
      text: "text-red-800",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-500",
      dot: "bg-orange-500",
      text: "text-orange-800",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      dot: "bg-yellow-500",
      text: "text-yellow-800",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-500",
      dot: "bg-purple-500",
      text: "text-purple-800",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      dot: "bg-blue-500",
      text: "text-blue-800",
    },
  };

  const nextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  // Auto-rotacionar a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentNews = newsItems[currentNewsIndex];
  const colors = colorClasses[currentNews.color as keyof typeof colorClasses];

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-2">
        <Shield className="text-blue-600 w-16 h-16" />
      </div>
      
      <h1 className="text-2xl font-bold text-center text-blue-700">
        Scam<br />Simulador educativo anti-golpes
      </h1>

      <p className="text-gray-600 text-center">
        Aprenda a identificar e evitar golpes online com este simulador interativo.
      </p>

      <motion.button 
        className={`${buttonClass} bg-white border border-blue-700 text-blue-700 hover:bg-blue-50`} 
        onClick={() => setStep('login')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Entrar
      </motion.button>

      <motion.button 
        className={`${buttonClass} bg-blue-700 hover:bg-blue-800 text-white`} 
        onClick={() => setStep('register')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Registrar
      </motion.button>

      {/* Seção de Manchetes sobre Golpes - Carrossel */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-gray-800">Notícias sobre Golpes</h2>
          <TrendingUp className="w-5 h-5 text-orange-600" />
        </div>
        
        {/* Carrossel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNewsIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={`${colors.bg} border-l-4 ${colors.border} p-4 rounded-r-lg hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 ${colors.dot} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${colors.text}`}>
                    {currentNews.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {currentNews.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botões de Navegação */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prevNews}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Notícia anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Indicadores de posição */}
            <div className="flex gap-2">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNewsIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentNewsIndex
                      ? `${colors.dot} w-6`
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Ir para notícia ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextNews}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Próxima notícia"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
          <p className="text-xs text-gray-700 font-medium">
            💡 <span className="font-semibold">Proteja-se:</span> Aprenda a identificar golpes com nosso simulador interativo!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Welcome;
