import { motion } from 'framer-motion';
import { StepType } from '../features/SimuladorAntiGolpes';
import { useState } from 'react';
import { Eye, EyeOff, UserPlus, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { userApi } from '../services/api';

interface RegistrationProps {
  setStep: (step: StepType) => void;
}

const Registration = ({ setStep }: RegistrationProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitError('');
    setShowValidationMessage(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const { name, email, password } = formData;

    if (!name) newErrors.name = 'Nome é obrigatório.';
    if (!email) {
      newErrors.email = 'Email é obrigatório.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Digite um e-mail válido.';
      }
    }
    if (!password) newErrors.password = 'Senha é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (field: string) =>
    `w-full border-2 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
      errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
    }`;

  const labelClass = (field: string) =>
    `block text-sm font-semibold mb-2 ${
      errors[field] ? 'text-red-600' : 'text-gray-700'
    }`;

  const handleSubmit = async () => {
    setSubmitError('');
    setShowValidationMessage(false);
    
    if (!validateForm()) {
      setShowValidationMessage(true);
      return;
    }
    
    if (!isLoading) {
      setIsLoading(true);
      setSubmitError('');
      
      try {
        // Verifica se o email já está cadastrado
        const existingUser = await userApi.getUserByEmail(formData.email);
        if (existingUser) {
          setSubmitError('Este email já está cadastrado.');
          setIsLoading(false);
          return;
        }

        // Salva o usuário na API
        const newUser = await userApi.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          score: 0
        });

        // Salva o userId temporariamente no localStorage para o Interests usar
        if (newUser.id) {
          localStorage.setItem('tempUserId', newUser.id.toString());
          
          // Também salva no currentUser para manter o estado de login
          localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            score: newUser.score || 0
          }));
        }

        // Limpa o formulário e vai para a próxima tela
        setFormData({ name: '', email: '', password: '' });
        setStep('interests');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar usuário. Verifique se a API está rodando na porta 8081.';
        setSubmitError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
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
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <UserPlus className="text-white w-12 h-12" />
          </div>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          CRIAR CONTA
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Preencha seus dados para começar a aprender
        </p>
      </motion.div>

      {/* Form */}
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="name" className={labelClass('name')}>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome completo
            </div>
          </label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo" 
            className={inputClass('name')} 
          />
          {errors.name && (
            <motion.p 
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.name}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="email" className={labelClass('email')}>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </div>
          </label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com" 
            className={inputClass('email')} 
          />
          {errors.email && (
            <motion.p 
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label htmlFor="password" className={labelClass('password')}>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha
            </div>
          </label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite uma senha segura" 
              className={`${inputClass('password')} pr-12`} 
            />
            <motion.button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
          </div>
          {errors.password && (
            <motion.p 
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Error Messages */}
      {showValidationMessage && Object.values(errors).length > 0 && (
        <motion.div 
          className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Corrija os campos destacados acima.
        </motion.div>
      )}

      {submitError && (
        <motion.div 
          className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {submitError}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-2">
        <motion.button 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all shadow-md" 
          onClick={() => setStep('welcome')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02, x: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </motion.button>
        
        <motion.button 
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={isLoading ? {} : { scale: 1.02, y: -2 }}
          whileTap={isLoading ? {} : { scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              Cadastrando...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Continuar
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Registration;
