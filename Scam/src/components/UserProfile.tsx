import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Play, Trophy, TrendingUp, BarChart3, Edit2, Save, X, Eye, EyeOff, Shield, Heart } from 'lucide-react';
import { quizAttemptApi, QuizAttempt, userApi, User } from '../services/api';
import { buttonClass } from '../styles/common';
import AdminPanel from './AdminPanel';
import { interestsList } from '../data/interests';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface UserProfileProps {
  userId: number;
  userName: string;
  onPlay: () => void;
  onLogout: () => void;
  onUserNameUpdate?: (newName: string) => void;
}

const UserProfile = ({ userId, userName, onPlay, onLogout, onUserNameUpdate }: UserProfileProps) => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    lastAttempt: null as QuizAttempt | null | undefined,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [initialInterests, setInitialInterests] = useState<string[]>([]); // Para restaurar ao cancelar
  const [interestsLoading, setInterestsLoading] = useState(false);

  // Verificar se o usuário é admin (baseado no email)
  useEffect(() => {
    if (userData) {
      // Lista de emails de admin (pode ser configurado)
      const adminEmails = ['admin@admin.com', 'admin@scam.com'];
      setIsAdmin(adminEmails.includes(userData.email.toLowerCase()));
    }
  }, [userData]);

  useEffect(() => {
    loadUserData();
    loadUserInfo();
  }, [userId]);

  const loadUserInfo = async () => {
    try {
      const user = await userApi.getUserById(userId);
      setUserData(user);
      setEditForm({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Carrega interesses do banco
      if (user.interests) {
        try {
          const interests = JSON.parse(user.interests);
          setSelectedInterests(Array.isArray(interests) ? interests : []);
          // Atualiza também o localStorage para uso no quiz
          localStorage.setItem('userInterests', JSON.stringify(interests));
        } catch {
          setSelectedInterests([]);
        }
      } else {
        // Se não tem no banco, tenta carregar do localStorage
        const saved = localStorage.getItem('userInterests');
        if (saved) {
          try {
            const interests = JSON.parse(saved);
            setSelectedInterests(Array.isArray(interests) ? interests : []);
          } catch {
            setSelectedInterests([]);
          }
        } else {
          setSelectedInterests([]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error);
    }
  };

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userAttempts = await quizAttemptApi.getQuizAttemptsByUserId(userId);
      // Calcular estatísticas
      if (userAttempts.length === 0) {
        setStats({
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          lastAttempt: null,
        });
      } else {
        const totalScore = userAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
        const averageScore = Math.round((totalScore / userAttempts.length) * 10) / 10;
        const bestScore = Math.max(...userAttempts.map(a => a.score));
        const lastAttempt = userAttempts[0]; // Já está ordenado por data desc
        
        setStats({
          totalAttempts: userAttempts.length,
          averageScore,
          bestScore,
          lastAttempt,
        });
      }
      setAttempts(userAttempts);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepara dados para o gráfico
  const chartData = attempts
    .slice()
    .reverse()
    .map((attempt, index) => ({
      name: `Jogada ${index + 1}`,
      score: attempt.score,
      percentage: attempt.percentage,
      date: attempt.completedAt 
        ? new Date(attempt.completedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          })
        : 'N/A',
    }));

  // Formata data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Abrir modal de edição
  const openEditModal = async () => {
    await loadUserInfo();
    setIsEditModalOpen(true);
    setEditError('');
  };

  // Fechar modal de edição
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditError('');
    setEditForm({
      name: userData?.name || '',
      email: userData?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Abrir modal de interesses
  const openInterestsModal = async () => {
    await loadUserInfo();
    // Salva o estado inicial dos interesses para poder restaurar ao cancelar
    setInitialInterests([...selectedInterests]);
    setIsInterestsModalOpen(true);
  };

  // Fechar modal de interesses
  const closeInterestsModal = () => {
    setIsInterestsModalOpen(false);
  };

  // Cancelar edição de interesses (restaura estado inicial)
  const cancelInterestsEdit = () => {
    setSelectedInterests([...initialInterests]);
    closeInterestsModal();
  };

  // Toggle interesse
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(item => item !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  // Salvar interesses
  const saveInterests = async () => {
    setInterestsLoading(true);

    try {
      // Garante que sempre temos um array válido (mesmo que vazio)
      const interestsArray = Array.isArray(selectedInterests) ? selectedInterests : [];
      const interestsJson = JSON.stringify(interestsArray);
      
      // Atualizar usuário - seguindo o mesmo padrão do saveProfile
      const updateData: Partial<User> = {
        interests: interestsJson
      };

      await userApi.updateUser(userId, updateData);

      // Atualizar localStorage para uso imediato no quiz
      localStorage.setItem('userInterests', JSON.stringify(interestsArray));

      // Recarregar dados
      await loadUserInfo();
      
      // Fechar modal após sucesso
      closeInterestsModal();
    } catch (error) {
      console.error('Erro ao salvar interesses:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar interesses';
      alert(`Erro ao salvar interesses: ${errorMessage}`);
    } finally {
      setInterestsLoading(false);
    }
  };

  // Salvar edições
  const saveProfile = async () => {
    setEditError('');
    setEditLoading(true);

    try {
      // Validações
      if (!editForm.name.trim()) {
        setEditError('Nome é obrigatório');
        setEditLoading(false);
        return;
      }

      if (!editForm.email.trim()) {
        setEditError('Email é obrigatório');
        setEditLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        setEditError('Email inválido');
        setEditLoading(false);
        return;
      }

      // Se está tentando alterar a senha
      if (editForm.newPassword || editForm.confirmPassword || editForm.currentPassword) {
        if (!editForm.currentPassword) {
          setEditError('Digite sua senha atual para alterar a senha');
          setEditLoading(false);
          return;
        }

        // Verificar senha atual
        if (userData) {
          const isValid = await userApi.validateCredentials(userData.email, editForm.currentPassword);
          if (!isValid) {
            setEditError('Senha atual incorreta');
            setEditLoading(false);
            return;
          }
        }

        if (!editForm.newPassword) {
          setEditError('Digite a nova senha');
          setEditLoading(false);
          return;
        }

        if (editForm.newPassword.length < 4) {
          setEditError('A nova senha deve ter pelo menos 4 caracteres');
          setEditLoading(false);
          return;
        }

        if (editForm.newPassword !== editForm.confirmPassword) {
          setEditError('As senhas não coincidem');
          setEditLoading(false);
          return;
        }
      }

      // Atualizar usuário
      const updateData: Partial<User> = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      };

      if (editForm.newPassword) {
        updateData.password = editForm.newPassword;
      }

      await userApi.updateUser(userId, updateData);

      // Atualizar localStorage
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        userData.name = editForm.name.trim();
        userData.email = editForm.email.trim();
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }

      // Notificar componente pai sobre mudança de nome
      if (onUserNameUpdate) {
        onUserNameUpdate(editForm.name.trim());
      }

      // Recarregar dados
      await loadUserInfo();
      closeEditModal();
    } catch (error) {
      setEditError('Erro ao atualizar perfil. Tente novamente.');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-gray-500">Carregando seus dados...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        {/* Saudação e Botão Sair */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Olá, {userName}!</h1>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Botões */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={openInterestsModal}
            className="flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-md transition-colors"
            title="Editar interesses"
          >
            <Heart className="w-4 h-4" />
            Interesses
          </button>
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            title="Editar perfil"
          >
            <Edit2 className="w-4 h-4" />
            Editar Perfil
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
              title="Painel Administrativo"
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          )}
        </div>

        {/* Texto de acompanhamento */}
        <div className="mb-6 pb-4 border-b">
          <p className="text-gray-600 text-sm">Acompanhe sua evolução</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total de Jogadas</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalAttempts}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Média de Acertos</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {stats.averageScore.toFixed(1)}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Melhor Pontuação</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">{stats.bestScore}</div>
        </div>
      </div>

      {/* Gráfico de Evolução */}
      {attempts.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Evolução das Pontuações</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Pontos', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'score') return [`${value} pontos`, 'Acertos'];
                    if (name === 'percentage')
                      return [`${value}%`, 'Percentual'];
                    return value;
                  }}
                  labelFormatter={(label) => `Jogada: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center py-8 bg-gray-50 rounded-lg">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Você ainda não tem jogadas registradas</p>
          <p className="text-gray-500 text-sm mt-1">
            Comece a jogar para ver sua evolução aqui!
          </p>
        </div>
      )}

      {/* Histórico de Jogadas */}
      {attempts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Jogadas</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {attempts.slice(0, 5).map((attempt, index) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {attempt.score} de {attempt.totalQuestions} acertos
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(attempt.completedAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      attempt.percentage >= 70
                        ? 'text-green-600'
                        : attempt.percentage >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {attempt.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão Jogar */}
      <div className="flex justify-center">
        <motion.button
          onClick={onPlay}
          className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 max-w-xs`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-5 h-5" />
          Começar Quiz
        </motion.button>
      </div>

      {/* Modal de Edição de Perfil */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Editar Perfil</h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-4 space-y-4">
                {editError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {editError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Alterar Senha (opcional)</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={editForm.currentPassword}
                          onChange={(e) => setEditForm({ ...editForm, currentPassword: e.target.value })}
                          className="w-full border rounded-md p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={editForm.newPassword}
                          onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                          className="w-full border rounded-md p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Digite a nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={editForm.confirmPassword}
                          onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                          className="w-full border rounded-md p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirme a nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="flex gap-2 justify-end p-4 border-t">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  disabled={editLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Painel Administrativo */}
      {/* Modal de Edição de Interesses */}
      <AnimatePresence>
        {isInterestsModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeInterestsModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => {
                // Sempre previne propagação para qualquer clique dentro do modal
                e.stopPropagation();
              }}
            >
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Editar Interesses
                </h2>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeInterestsModal();
                  }}
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-4">
                <p className="text-gray-600 mb-4 text-sm">
                  Selecione os tópicos que mais interessam você. As perguntas do quiz serão priorizadas com base nos seus interesses.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((item, index) => (
                    <motion.button
                      key={item.name}
                      title={item.description}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleInterest(item.name);
                      }}
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedInterests.includes(item.name) 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </div>

                {selectedInterests.length > 0 && (
                  <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-800">
                      <strong>{selectedInterests.length}</strong> interesse{selectedInterests.length !== 1 ? 's' : ''} selecionado{selectedInterests.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer do Modal */}
              <div className="flex items-center justify-end gap-3 p-4 border-t sticky bottom-0 bg-white z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cancelInterestsEdit();
                  }}
                  className={`${buttonClass} px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800`}
                  disabled={interestsLoading}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    saveInterests();
                  }}
                  type="button"
                  className={`${buttonClass} px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 relative z-30 ${interestsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={interestsLoading}
                >
                  {interestsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />

      {/* Modal de Confirmação de Logout */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col gap-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Deseja realmente sair?
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Você será desconectado e precisará fazer login novamente para acessar seu perfil.
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className={`${buttonClass} bg-gray-300 hover:bg-gray-400 text-gray-800`}
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white`}
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                >
                  Sair
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserProfile;

