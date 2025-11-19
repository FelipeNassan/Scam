import { motion } from 'framer-motion';
import { StepType } from '../features/SimuladorAntiGolpes';
import { buttonClass } from '../styles/common';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { userApi, User } from '../services/api';

interface LoginProps {
  setStep: (step: StepType) => void;
  onLoginSuccess: (user: string, userId: number) => void;
}

const Login = ({ setStep, onLoginSuccess }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLoginError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const { email, password } = formData;

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

  const handleSubmit = async () => {
    setLoginError('');
    if (validateForm() && !isLoading) {
      setIsLoading(true);
      
      try {
        // Valida credenciais na API
        const validUser = await userApi.validateCredentials(formData.email, formData.password);
        
        if (validUser) {
          // Salva o usuário logado no localStorage para manter o estado de login
          localStorage.setItem('currentUser', JSON.stringify({
            id: validUser.id,
            name: validUser.name,
            email: validUser.email,
            score: validUser.score
          }));
          
          // Chama o callback de sucesso de login
          if (validUser.id) {
            onLoginSuccess(validUser.name, validUser.id);
            // Vai para a tela de perfil
            setStep('profile');
          }
        } else {
          setLoginError('Email ou senha incorretos.');
        }
      } catch (error) {
        setLoginError('Erro ao fazer login. Verifique se a API está rodando na porta 8081.');
        console.error('Erro no login:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputClass = (field: string) =>
    `w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  const labelClass = (field: string) =>
    `block text-sm font-medium mb-1 ${
      errors[field] ? 'text-red-600' : 'text-gray-700'
    }`;

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-blue-700 text-center mb-2">ENTRAR</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass('email')}>Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com" 
            className={inputClass('email')} 
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClass('password')}>Senha</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha" 
              className={`${inputClass('password')} pr-10`} 
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>
      </div>

      {Object.values(errors).length > 0 && (
        <div className="text-red-600 text-sm mt-2 text-center">
          Corrija os campos destacados acima.
        </div>
      )}

      {loginError && (
        <div className="text-red-600 text-sm mt-2 text-center">
          {loginError}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <motion.button 
          className={`${buttonClass} flex-1 bg-gray-400 hover:bg-gray-500`} 
          onClick={() => setStep('welcome')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Voltar
        </motion.button>
        
        <motion.button 
          className={`${buttonClass} flex-1 bg-blue-700 hover:bg-blue-800 text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          whileHover={isLoading ? {} : { scale: 1.03 }}
          whileTap={isLoading ? {} : { scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Continuar'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Login;
