import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Edit2, Trash2, Save, Eye, EyeOff, Search, BarChart3, TrendingUp, Trophy, UserCheck, FileQuestion } from 'lucide-react';
import { userApi, User, quizAttemptApi, QuizAttempt } from '../services/api';
import { getAllQuestions, QuestionType } from '../data/questions';
import { interestsList } from '../data/interests';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para a aba de questões
  const [activeTab, setActiveTab] = useState<'users' | 'questions'>('users');
  const [allQuestions, setAllQuestions] = useState<QuestionType[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>([]);
  const [selectedInterestFilter, setSelectedInterestFilter] = useState<string>('all');

  // Carregar usuários e métricas
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const loadedUsers = await userApi.getAllUsers();
      setAllUsers(loadedUsers);
      
      // Carregar todas as tentativas para métricas
      try {
        const attempts = await quizAttemptApi.getAllQuizAttempts();
        setAllAttempts(attempts);
      } catch (err) {
        console.error('Erro ao carregar tentativas:', err);
      }
    } catch (err) {
      setError('Erro ao carregar usuários. Verifique se a API está rodando na porta 8081.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuários baseado no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsers(allUsers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
      setUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  // Calcular métricas
  const metrics = {
    totalUsers: allUsers.length,
    totalAttempts: allAttempts.length,
    averageScore: allUsers.length > 0
      ? Math.round((allUsers.reduce((sum, u) => sum + (u.score || 0), 0) / allUsers.length) * 10) / 10
      : 0,
    bestScore: allUsers.length > 0
      ? Math.max(...allUsers.map(u => u.score || 0))
      : 0,
    averageAttemptScore: allAttempts.length > 0
      ? Math.round((allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length) * 10) / 10
      : 0,
  };

  // Carregar questões
  useEffect(() => {
    if (isOpen && activeTab === 'questions') {
      const questions = getAllQuestions();
      setAllQuestions(questions);
      setFilteredQuestions(questions);
    }
  }, [isOpen, activeTab]);

  // Filtrar questões por interesse
  useEffect(() => {
    if (activeTab === 'questions') {
      if (selectedInterestFilter === 'all') {
        setFilteredQuestions(allQuestions);
      } else {
        const filtered = allQuestions.filter(question => 
          question.interests && question.interests.includes(selectedInterestFilter)
        );
        setFilteredQuestions(filtered);
      }
    }
  }, [selectedInterestFilter, allQuestions, activeTab]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      setSearchTerm('');
      // Carregar questões quando abrir
      const questions = getAllQuestions();
      setAllQuestions(questions);
      setFilteredQuestions(questions);
    } else {
      // Limpar filtro ao fechar
      setSearchTerm('');
      setSelectedInterestFilter('all');
    }
  }, [isOpen]);

  // Iniciar edição
  const startEdit = (user: User) => {
    setEditingId(user.id || null);
    setEditForm({
      name: user.name,
      email: user.email,
      password: user.password,
      score: user.score,
    });
    setError('');
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError('');
  };

  // Salvar edição
  const saveEdit = async () => {
    if (!editingId) return;

    setError('');
    try {
      // Validação básica
      if (!editForm.name || !editForm.email) {
        setError('Nome e email são obrigatórios');
        return;
      }

      if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
        setError('Email inválido');
        return;
      }

      await userApi.updateUser(editingId, {
        name: editForm.name!,
        email: editForm.email!,
        password: editForm.password || '',
        score: editForm.score || 0,
      });

      await loadUsers();
      cancelEdit();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
    }
  };

  // Remover usuário
  const deleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setError('');
    try {
      await userApi.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError('Erro ao remover usuário');
      console.error(err);
    }
  };

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Toggle mostrar senha
  const togglePasswordVisibility = (userId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Users className="text-blue-600 w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-800">Painel Administrativo</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Usuários
              </div>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'questions'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileQuestion className="w-4 h-4" />
                Questões
              </div>
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Conteúdo da aba de Questões */}
            {activeTab === 'questions' && (
              <div>
                {/* Filtro por Interesse */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por Interesse
                  </label>
                  <select
                    value={selectedInterestFilter}
                    onChange={(e) => setSelectedInterestFilter(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="all">Todos os Interesses</option>
                    {interestsList.map((interest) => (
                      <option key={interest.name} value={interest.name}>
                        {interest.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-sm text-gray-500 mt-2">
                    Mostrando {filteredQuestions.length} de {allQuestions.length} questão{allQuestions.length !== 1 ? 'ões' : ''}
                    {selectedInterestFilter !== 'all' && (
                      <span> relacionadas a "{selectedInterestFilter}"</span>
                    )}
                  </div>
                </div>

                {/* Lista de Questões */}
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {selectedInterestFilter === 'all' 
                      ? 'Nenhuma questão cadastrada'
                      : `Nenhuma questão encontrada para o interesse "${selectedInterestFilter}"`
                    }
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredQuestions.map((question, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-800 flex-1">
                              {index + 1}. {question.question}
                            </h3>
                          </div>
                          
                          {/* Alternativas */}
                          <div className="space-y-2 mt-3">
                            {question.options.map((opt) => (
                              <div
                                key={opt.label}
                                className={`p-2 rounded ${
                                  opt.label === question.correct
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-gray-50'
                                }`}
                              >
                                <span className="font-semibold text-gray-700">
                                  {opt.label}:
                                </span>{' '}
                                <span className={opt.label === question.correct ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                  {opt.text}
                                </span>
                                {opt.label === question.correct && (
                                  <span className="ml-2 text-green-600 font-semibold text-xs">
                                    ✓ Correta
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Dica */}
                          <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                            <span className="text-xs font-semibold text-blue-700">Dica: </span>
                            <span className="text-sm text-blue-800">{question.tip}</span>
                          </div>

                          {/* Interesses relacionados */}
                          {question.interests && question.interests.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              <span className="text-xs font-semibold text-gray-600 mr-1">Interesses:</span>
                              {question.interests.map((interest, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Conteúdo da aba de Usuários */}
            {activeTab === 'users' && (
              <>
                {/* Métricas Gerais */}
            {!loading && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Métricas Gerais</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-600">Total Usuários</span>
                    </div>
                    <div className="text-xl font-bold text-blue-700">{metrics.totalUsers}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-gray-600">Total Tentativas</span>
                    </div>
                    <div className="text-xl font-bold text-green-700">{metrics.totalAttempts}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-gray-600">Média Score</span>
                    </div>
                    <div className="text-xl font-bold text-purple-700">{metrics.averageScore.toFixed(1)}</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-medium text-gray-600">Melhor Score</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-700">{metrics.bestScore}</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-medium text-gray-600">Média Tentativas</span>
                    </div>
                    <div className="text-xl font-bold text-indigo-700">{metrics.averageAttemptScore.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Filtro de Busca */}
            {!loading && allUsers.length > 0 && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Mostrando {users.length} de {allUsers.length} usuário{allUsers.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 text-gray-500">Carregando usuários...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhum usuário encontrado com o termo de busca' : 'Nenhum usuário cadastrado'}
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingId === user.id ? (
                      // Modo edição
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome
                            </label>
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Senha
                            </label>
                            <input
                              type="text"
                              value={editForm.password || ''}
                              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Score
                            </label>
                            <input
                              type="number"
                              value={editForm.score || 0}
                              onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) || 0 })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={saveEdit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Modo visualização
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Criado: {formatDate(user.createdAt)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Senha</div>
                          <div className="flex items-center gap-2 justify-center">
                            <span className="font-mono text-sm">
                              {showPasswords[user.id || 0] ? user.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id || 0)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {showPasswords[user.id || 0] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Score</div>
                          <div className="font-bold text-blue-600">{user.score}</div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => startEdit(user)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                            title="Editar usuário"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id!, user.name)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                            title="Remover usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex justify-between items-center">
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
            >
              Atualizar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminPanel;

