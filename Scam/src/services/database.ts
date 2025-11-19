// ⚠️ ARQUIVO OBSOLETO - NÃO ESTÁ MAIS SENDO USADO
// Este arquivo foi substituído por api.ts que conecta com a API Spring Boot
// Mantido apenas como referência/backup
// 
// Serviço de banco de dados local usando IndexedDB (LEGADO)

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  score: number;
  createdAt: number;
  updatedAt: number;
}

export interface QuizAttempt {
  id?: number;
  userId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: number;
}

class DatabaseService {
  private dbName = 'ScamDB';
  private dbVersion = 2;
  private storeName = 'users';
  private attemptsStoreName = 'quizAttempts';
  private db: IDBDatabase | null = null;

  // Inicializa o banco de dados
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Erro ao abrir o banco de dados'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        // Cria a object store de usuários se não existir
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
          
          // Cria índice único para email
          objectStore.createIndex('email', 'email', { unique: true });
          objectStore.createIndex('name', 'name', { unique: false });
        }
        
        // Cria a object store de tentativas de quiz (versão 2)
        if (oldVersion < 2 && !db.objectStoreNames.contains(this.attemptsStoreName)) {
          const attemptsStore = db.createObjectStore(this.attemptsStoreName, {
            keyPath: 'id',
            autoIncrement: true,
          });
          
          // Cria índice para buscar tentativas por usuário
          attemptsStore.createIndex('userId', 'userId', { unique: false });
          attemptsStore.createIndex('completedAt', 'completedAt', { unique: false });
        }
      };
    });
  }

  // Garante que o banco está inicializado
  private async ensureInitialized(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }

  // Adiciona um novo usuário
  async addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      
      const now = Date.now();
      const newUser: User = {
        ...user,
        createdAt: now,
        updatedAt: now,
      };

      const request = objectStore.add(newUser);

      request.onsuccess = () => {
        const userId = request.result as number;
        resolve({ ...newUser, id: userId });
      };

      request.onerror = () => {
        if (request.error?.name === 'ConstraintError') {
          reject(new Error('Este email já está cadastrado'));
        } else {
          reject(new Error('Erro ao adicionar usuário'));
        }
      };
    });
  }

  // Busca um usuário por email
  async getUserByEmail(email: string): Promise<User | null> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const index = objectStore.index('email');
      const request = index.get(email);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result || null);
      };

      request.onerror = () => {
        reject(new Error('Erro ao buscar usuário'));
      };
    });
  }

  // Busca um usuário por ID
  async getUserById(id: number): Promise<User | null> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result || null);
      };

      request.onerror = () => {
        reject(new Error('Erro ao buscar usuário'));
      };
    });
  }

  // Verifica credenciais de login
  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      return null;
    }

    if (user.password === password) {
      return user;
    }

    return null;
  }

  // Atualiza o score de um usuário
  async updateUserScore(userId: number, score: number): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(userId);

      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          user.score = score;
          user.updatedAt = Date.now();
          const updateRequest = objectStore.put(user);
          
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(new Error('Erro ao atualizar score'));
        } else {
          reject(new Error('Usuário não encontrado'));
        }
      };

      request.onerror = () => {
        reject(new Error('Erro ao buscar usuário'));
      };
    });
  }

  // Atualiza um usuário completo
  async updateUser(userId: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(userId);

      request.onsuccess = () => {
        const user = request.result;
        if (!user) {
          reject(new Error('Usuário não encontrado'));
          return;
        }

        // Se estiver atualizando o email, verifica se já existe
        if (updates.email && updates.email !== user.email) {
          const emailCheck = objectStore.index('email').get(updates.email);
          emailCheck.onsuccess = () => {
            if (emailCheck.result) {
              reject(new Error('Este email já está cadastrado'));
              return;
            }
            performUpdate();
          };
          emailCheck.onerror = () => performUpdate();
        } else {
          performUpdate();
        }

        function performUpdate() {
          const updatedUser: User = {
            ...user,
            ...updates,
            id: userId,
            updatedAt: Date.now(),
          };

          const updateRequest = objectStore.put(updatedUser);
          
          updateRequest.onsuccess = () => resolve(updatedUser);
          updateRequest.onerror = () => reject(new Error('Erro ao atualizar usuário'));
        }
      };

      request.onerror = () => {
        reject(new Error('Erro ao buscar usuário'));
      };
    });
  }

  // Busca todos os usuários (útil para debug)
  async getAllUsers(): Promise<User[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Erro ao buscar usuários'));
      };
    });
  }

  // Remove um usuário (útil para limpeza)
  async deleteUser(userId: number): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(userId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Erro ao remover usuário'));
    });
  }

  // Salva uma tentativa de quiz
  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<QuizAttempt> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.attemptsStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.attemptsStoreName);
      
      const newAttempt: QuizAttempt = {
        ...attempt,
        completedAt: Date.now(),
      };

      const request = objectStore.add(newAttempt);

      request.onsuccess = () => {
        const attemptId = request.result as number;
        resolve({ ...newAttempt, id: attemptId });
      };

      request.onerror = () => {
        reject(new Error('Erro ao salvar tentativa de quiz'));
      };
    });
  }

  // Busca todas as tentativas de um usuário
  async getUserQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }

      const transaction = this.db.transaction([this.attemptsStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.attemptsStoreName);
      const index = objectStore.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        // Ordena por data (mais recente primeiro)
        const attempts = request.result.sort((a, b) => b.completedAt - a.completedAt);
        resolve(attempts);
      };

      request.onerror = () => {
        reject(new Error('Erro ao buscar tentativas de quiz'));
      };
    });
  }

  // Busca estatísticas do usuário
  async getUserStats(userId: number): Promise<{
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    lastAttempt?: QuizAttempt;
  }> {
    const attempts = await this.getUserQuizAttempts(userId);
    
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
      };
    }

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = Math.round((totalScore / attempts.length) * 10) / 10;
    const bestScore = Math.max(...attempts.map(a => a.score));
    const lastAttempt = attempts[0]; // Já está ordenado

    return {
      totalAttempts: attempts.length,
      averageScore,
      bestScore,
      lastAttempt,
    };
  }
}

// Instância singleton do serviço
export const dbService = new DatabaseService();

// Inicializa o banco quando o módulo é carregado
dbService.init().catch((error) => {
  console.error('Erro ao inicializar banco de dados:', error);
});

// Funções utilitárias para visualização (disponíveis no console do navegador)
if (typeof window !== 'undefined') {
  // Expor funções úteis no objeto window para facilitar acesso no console
  (window as any).viewDB = {
    // Ver todos os usuários
    getAllUsers: async () => {
      try {
        const users = await dbService.getAllUsers();
        console.table(users);
        return users;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return null;
      }
    },
    
    // Buscar usuário por email
    getUserByEmail: async (email: string) => {
      try {
        const user = await dbService.getUserByEmail(email);
        if (user) {
          console.log('Usuário encontrado:', user);
          return user;
        } else {
          console.log('Usuário não encontrado');
          return null;
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
      }
    },
    
    // Buscar usuário por ID
    getUserById: async (id: number) => {
      try {
        const user = await dbService.getUserById(id);
        if (user) {
          console.log('Usuário encontrado:', user);
          return user;
        } else {
          console.log('Usuário não encontrado');
          return null;
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
      }
    },
    
    // Limpar todos os usuários (CUIDADO!)
    clearAllUsers: async () => {
      try {
        const users = await dbService.getAllUsers();
        for (const user of users) {
          if (user.id) {
            await dbService.deleteUser(user.id);
          }
        }
        console.log('Todos os usuários foram removidos');
      } catch (error) {
        console.error('Erro ao limpar usuários:', error);
      }
    },
    
    // Ajuda
    help: () => {
      console.log(`
🔍 FUNÇÕES DISPONÍVEIS NO viewDB:

1. viewDB.getAllUsers()
   - Lista todos os usuários cadastrados em formato de tabela

2. viewDB.getUserByEmail('email@exemplo.com')
   - Busca um usuário pelo email

3. viewDB.getUserById(1)
   - Busca um usuário pelo ID

4. viewDB.clearAllUsers()
   - ⚠️ Remove TODOS os usuários do banco (use com cuidado!)

5. viewDB.help()
   - Mostra esta mensagem de ajuda

📊 EXEMPLO DE USO:
   viewDB.getAllUsers()
   viewDB.getUserByEmail('usuario@email.com')
      `);
    }
  };
  
  // Mostrar mensagem de ajuda ao carregar
  console.log(
    '%c💾 Banco de Dados ScamDB',
    'color: #4F46E5; font-weight: bold; font-size: 14px;'
  );
  console.log(
    '%cDigite viewDB.help() para ver as funções disponíveis',
    'color: #6B7280; font-size: 12px;'
  );
}

