// Serviço de API para comunicação com o backend Spring Boot

const API_BASE_URL = 'http://localhost:8081';

// Interfaces para tipagem
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  score: number;
  interests?: string; // JSON string array de interesses
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttempt {
  id?: number;
  userId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt?: string;
}

// Função auxiliar para obter headers de requisição
function getHeaders(includeContentType = false): HeadersInit {
  const headers: Record<string, string> = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
}

// Função auxiliar para tratar erros
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Erro de autenticação (401). Verifique se o token de API está configurado corretamente.');
    }
    const errorText = await response.text();
    throw new Error(`Erro na requisição: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
}

// ==================== USER API ====================

export const userApi = {
  // Listar todos os usuários
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(),
    });
    return handleResponse<User[]>(response);
  },

  // Buscar usuário por ID
  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse<User>(response);
  },

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`, {
        headers: getHeaders(),
      });
      if (response.status === 404) {
        return null;
      }
      return handleResponse<User>(response);
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      return null;
    }
  },

  // Criar novo usuário
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(user),
    });
    return handleResponse<User>(response);
  },

  // Atualizar usuário
  async updateUser(id: number, user: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(user),
    });
    return handleResponse<User>(response);
  },

  // Deletar usuário
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Erro ao deletar usuário: ${response.status} ${response.statusText}`);
    }
  },

  // Validar credenciais de login
  async validateCredentials(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 401) {
        return null;
      }
      return handleResponse<User>(response);
    } catch (error) {
      console.error('Erro ao validar credenciais:', error);
      return null;
    }
  },
};

// ==================== QUIZ ATTEMPT API ====================

export const quizAttemptApi = {
  // Listar todas as tentativas
  async getAllQuizAttempts(): Promise<QuizAttempt[]> {
    const response = await fetch(`${API_BASE_URL}/quiz-attempts`, {
      headers: getHeaders(),
    });
    return handleResponse<QuizAttempt[]>(response);
  },

  // Buscar tentativa por ID
  async getQuizAttemptById(id: number): Promise<QuizAttempt> {
    const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse<QuizAttempt>(response);
  },

  // Buscar tentativas de um usuário
  async getQuizAttemptsByUserId(userId: number): Promise<QuizAttempt[]> {
    const response = await fetch(`${API_BASE_URL}/quiz-attempts/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse<QuizAttempt[]>(response);
  },

  // Criar nova tentativa
  async createQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<QuizAttempt> {
    const response = await fetch(`${API_BASE_URL}/quiz-attempts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(attempt),
    });
    return handleResponse<QuizAttempt>(response);
  },

  // Atualizar tentativa
  async updateQuizAttempt(id: number, attempt: Partial<Omit<QuizAttempt, 'id' | 'completedAt'>>): Promise<QuizAttempt> {
    const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(attempt),
    });
    return handleResponse<QuizAttempt>(response);
  },

  // Deletar tentativa
  async deleteQuizAttempt(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Erro ao deletar tentativa: ${response.status} ${response.statusText}`);
    }
  },
};

