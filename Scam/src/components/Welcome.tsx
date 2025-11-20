import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight, Sparkles, Lock, Zap, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { StepType } from '../features/SimuladorAntiGolpes';

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
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div 
        className="text-center mb-4"
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
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Shield className="text-white w-16 h-16" />
          </div>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Scam
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
          Simulador educativo anti-golpes
        </p>
        <p className="text-gray-600 text-base md:text-lg">
          Aprenda a identificar e evitar golpes online com este simulador interativo.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <motion.button 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all group" 
          onClick={() => setStep('login')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          Entrar
        </motion.button>

        <motion.button 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all group" 
          onClick={() => setStep('register')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Registrar
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Seção de Manchetes sobre Golpes - Carrossel */}
      <motion.div 
        className="mt-4 pt-6 border-t-2 border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Notícias sobre Golpes</h2>
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        
        {/* Carrossel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNewsIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`${colors.bg} border-l-4 ${colors.border} p-6 rounded-xl hover:shadow-lg transition-all relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-3 h-3 ${colors.dot} rounded-full mt-2 flex-shrink-0 shadow-md`}></div>
                <div className="flex-1">
                  <p className={`text-base md:text-lg font-bold ${colors.text} mb-2 leading-tight`}>
                    {currentNews.title}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {currentNews.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botões de Navegação */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              onClick={prevNews}
              className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-md"
              aria-label="Notícia anterior"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>

            {/* Indicadores de posição */}
            <div className="flex gap-2">
              {newsItems.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentNewsIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentNewsIndex
                      ? `${colors.dot} w-8`
                      : 'bg-gray-300 w-2'
                  }`}
                  aria-label={`Ir para notícia ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextNews}
              className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-md"
              aria-label="Próxima notícia"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>

        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 text-center shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <p className="text-sm md:text-base text-gray-800 font-semibold">
              Proteja-se
            </p>
          </div>
          <p className="text-xs md:text-sm text-gray-700">
            Aprenda a identificar golpes com nosso simulador interativo!
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
