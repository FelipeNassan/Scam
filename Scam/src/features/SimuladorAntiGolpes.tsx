import { useState, useEffect } from 'react';
import Welcome from '../components/Welcome';
import Registration from '../components/Registration';
import Login from '../components/Login';
import Interests from '../components/Interests';
import Quiz from '../components/Quiz';
import Result from '../components/Result';
import Completion from '../components/Completion';
import UserProfile from '../components/UserProfile';
import {
  questions as allOriginalQuestions,
  getRandomQuestions,
  getAllQuestions,
  QuestionType,
} from '../data/questions';
import { userApi, quizAttemptApi, User } from '../services/api';
import { saveQuestionAnswer } from '../services/questionStats';

export type StepType =
  | 'welcome'
  | 'register'
  | 'login'
  | 'profile'
  | 'interests'
  | 'quiz'
  | 'result'
  | 'end';

interface SimuladorAntiGolpesProps {
  onStepChange?: (step: StepType) => void;
}

const SimuladorAntiGolpes = ({ onStepChange }: SimuladorAntiGolpesProps = {}) => {
  // Controle de tela
  const [step, setStep] = useState<StepType>('welcome');
  
  // Notificar App sobre mudanças de step
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);
  
  // Usuário logado
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Quiz state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [shuffledQuizQuestions, setShuffledQuizQuestions] = useState<QuestionType[]>([]);
  const [selectedInterestFilter, setSelectedInterestFilter] = useState<string>('all');

  // Função para carregar interesses (do banco se logado, senão do localStorage)
  const getSavedInterests = async (): Promise<string[]> => {
    // Se o usuário está logado, sempre busca os dados mais recentes do banco
    if (userId) {
      try {
        // Busca os dados mais recentes do usuário do banco
        const user = await userApi.getUserById(userId);
        if (user && user.interests) {
          const interests = JSON.parse(user.interests);
          if (Array.isArray(interests)) {
            // Atualiza o userData no estado para manter sincronizado
            setUserData(user);
            // Atualiza também o localStorage para uso imediato
            localStorage.setItem('userInterests', JSON.stringify(interests));
            return interests;
          }
        }
      } catch (error) {
        console.error('Erro ao carregar interesses do banco:', error);
      }
    }
    
    // Fallback para localStorage
    try {
      const saved = localStorage.getItem('userInterests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Carregar perguntas: todas para admin, 10 aleatórias para usuários normais (priorizando interesses)
  useEffect(() => {
    const loadQuestions = async () => {
      if (isAdmin) {
        // Admin vê todas as perguntas (filtradas por interesse se selecionado)
        const allQuestions = getAllQuestions();
        if (selectedInterestFilter === 'all') {
          setShuffledQuizQuestions(allQuestions);
        } else {
          const filtered = allQuestions.filter(question => 
            question.interests && question.interests.includes(selectedInterestFilter)
          );
          setShuffledQuizQuestions(filtered);
        }
        // Resetar índice quando filtrar
        setQuestionIndex(0);
      }
      // Para usuários normais, as questões são carregadas explicitamente quando necessário
      // (no onPlay, resetQuiz, etc.) para evitar loops
    };
    loadQuestions();
  }, [isAdmin, selectedInterestFilter]);

  // Carregar questões automaticamente quando vai para o quiz (após selecionar interesses)
  useEffect(() => {
    const loadQuizQuestions = async () => {
      if (step === 'quiz' && !isAdmin && shuffledQuizQuestions.length === 0) {
        const savedInterests = await getSavedInterests();
        const newQuestions = getRandomQuestions(10, savedInterests);
        setShuffledQuizQuestions(newQuestions);
        setQuestionIndex(0);
        setScore(0);
        setIsCorrect(null);
      }
    };
    loadQuizQuestions();
  }, [step, isAdmin]);

  // Recarregar perguntas quando entrar no quiz (para atualizar com novos interesses)
  useEffect(() => {
    const reloadQuestions = async () => {
      if (step === 'quiz' && !isAdmin) {
        // Sempre recarrega as questões quando entra no quiz para garantir que usa os interesses mais recentes
        const savedInterests = await getSavedInterests();
        const newQuestions = getRandomQuestions(10, savedInterests);
        setShuffledQuizQuestions(newQuestions);
        // Resetar o índice quando recarregar as questões
        setQuestionIndex(0);
      }
    };
    reloadQuestions();
  }, [step, userId]);

  // Ao logar, carregar score salvo da API e verificar se é admin
  useEffect(() => {
    const loadUserScore = async () => {
      if (userId) {
        try {
          const user = await userApi.getUserById(userId);
          if (user) {
            setUserData(user);
            setScore(user.score);
            
            // Verificar se é admin (baseado no email)
            const adminEmails = ['admin@admin.com', 'admin@scam.com'];
            setIsAdmin(adminEmails.includes(user.email.toLowerCase()));
          } else {
            setScore(0);
            setUserData(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Erro ao carregar score:', error);
          setScore(0);
          setUserData(null);
          setIsAdmin(false);
        }
      } else {
        setScore(0);
        setUserData(null);
        setIsAdmin(false);
      }
    };

    loadUserScore();
  }, [userId]);

  const currentQuizQuestion = shuffledQuizQuestions[questionIndex];

  // Quando usuário responde
  const handleAnswer = (answer: string) => {
    if (!currentQuizQuestion) return;
    const correct = answer === currentQuizQuestion.correct;
    setIsCorrect(correct);
    
    // Salvar resposta individual (exceto para admin)
    if (!isAdmin) {
      saveQuestionAnswer(
        currentQuizQuestion.question,
        answer,
        currentQuizQuestion.correct
      );
    }
    
    if (correct) setScore(prev => prev + 1);
    
    // Admin não vai para tela de resultado, apenas navega
    if (isAdmin) {
      // Admin não precisa ver resultado, pode continuar navegando
      return;
    }
    
    setStep('result');
  };

  // Navegação para admin (anterior/próxima pergunta)
  const goToPreviousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(prev => prev - 1);
      setIsCorrect(null);
    }
  };

  const goToNextQuestion = () => {
    if (questionIndex + 1 < shuffledQuizQuestions.length) {
      setQuestionIndex(prev => prev + 1);
      setIsCorrect(null);
    }
  };

  // Próxima pergunta
  const nextQuestion = async () => {
    if (questionIndex + 1 < shuffledQuizQuestions.length) {
      setQuestionIndex(prev => prev + 1);
      setIsCorrect(null);
      setStep('quiz');
    } else {
      // Verifica se há userId no estado ou no localStorage
      let currentUserId = userId;
      if (!currentUserId) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          try {
            const userData = JSON.parse(currentUser);
            if (userData.id) {
              currentUserId = userData.id;
              // Atualiza o estado também
              setUserId(userData.id);
              if (userData.name) {
                setUsername(userData.name);
              }
            }
          } catch (error) {
            console.error('Erro ao recuperar userId do localStorage:', error);
          }
        }
      }
      
      // Salva histórico da partida e score ao final do quiz, se logado E não for admin
      if (currentUserId && !isAdmin) {
        try {
          const totalQuestions = shuffledQuizQuestions.length;
          const percentage = Math.round((score / totalQuestions) * 100);
          
          // Salva histórico da partida na API
          await quizAttemptApi.createQuizAttempt({
            userId: currentUserId,
            score,
            totalQuestions,
            percentage,
          });
          
          // Atualiza score máximo do usuário na API
          const user = await userApi.getUserById(currentUserId);
          if (user && score > user.score) {
            await userApi.updateUser(currentUserId, { score });
          }
          
          // Atualiza também no localStorage para manter sincronizado
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.score = Math.max(userData.score || 0, score);
            localStorage.setItem('currentUser', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Erro ao salvar histórico:', error);
        }
      }
      setStep('end');
    }
  };

  // Reinicia quiz (para jogar de novo)
  const resetQuiz = async () => {
    if (isAdmin) {
      setShuffledQuizQuestions(getAllQuestions());
    } else {
      const savedInterests = await getSavedInterests();
      setShuffledQuizQuestions(getRandomQuestions(10, savedInterests));
    }
    setQuestionIndex(0);
    setScore(0);
    setIsCorrect(null);
    setStep('quiz');
  };

  // Logout e reset geral
  const resetAll = () => {
    setUsername(null);
    setUserId(null);
    localStorage.removeItem('currentUser');
    // Carrega interesses do localStorage após logout
    try {
      const saved = localStorage.getItem('userInterests');
      const interests = saved ? JSON.parse(saved) : [];
      setShuffledQuizQuestions(getRandomQuestions(10, interests));
    } catch {
      setShuffledQuizQuestions(getRandomQuestions(10, []));
    }
    setQuestionIndex(0);
    setScore(0);
    setIsCorrect(null);
    setIsAdmin(false);
    setStep('welcome');
  };

  // Login bem-sucedido
  const onLoginSuccess = (user: string, id: number) => {
    setUsername(user);
    setUserId(id);
  };
  
  // Voltar para o perfil após jogar
  const goToProfile = async () => {
    if (isAdmin) {
      setShuffledQuizQuestions(getAllQuestions());
    } else {
      const savedInterests = await getSavedInterests();
      setShuffledQuizQuestions(getRandomQuestions(10, savedInterests));
    }
    setQuestionIndex(0);
    setScore(0);
    setIsCorrect(null);
    setStep('profile');
  };

  // Verifica se há usuário logado ao montar o componente e quando vai para quiz
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        if (userData.name && userData.id) {
          setUsername(userData.name);
          setUserId(userData.id);
          // O useEffect de loadUserScore vai carregar os dados completos e verificar se é admin
        }
      } catch (error) {
        console.error('Erro ao recuperar usuário logado:', error);
      }
    }
  }, []);

  // Verifica se há usuário logado quando vai para o quiz ou perfil (para casos de novo registro)
  useEffect(() => {
    if ((step === 'quiz' || step === 'profile' || step === 'end') && !userId) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          if (userData.name && userData.id) {
            setUsername(userData.name);
            setUserId(userData.id);
          }
        } catch (error) {
          console.error('Erro ao recuperar usuário logado:', error);
        }
      }
    }
  }, [step, userId]);


  const canRenderQuiz = step === 'quiz' && currentQuizQuestion;
  const canRenderResult = step === 'result' && currentQuizQuestion;

  return (
    <div className={`${isAdmin ? 'max-w-7xl' : step === 'welcome' ? 'max-w-5xl' : step === 'profile' ? 'max-w-7xl' : step === 'interests' ? 'max-w-7xl' : step === 'result' ? 'max-w-7xl' : 'max-w-md'} w-full mx-auto`}>
      {step === 'welcome' && <Welcome setStep={setStep} />}
      {step === 'register' && <Registration setStep={setStep} />}
      {step === 'login' && <Login setStep={setStep} onLoginSuccess={onLoginSuccess} />}
      {step === 'interests' && <Interests setStep={setStep} />}
      {canRenderQuiz && (
        <Quiz
          currentQuestion={currentQuizQuestion}
          questionNumber={questionIndex + 1}
          totalQuestions={shuffledQuizQuestions.length}
          onAnswer={handleAnswer}
          setStep={setStep}
          isAdmin={isAdmin}
          onPreviousQuestion={isAdmin ? goToPreviousQuestion : undefined}
          onNextQuestion={isAdmin ? goToNextQuestion : undefined}
          isLoggedIn={!!userId}
          onGoToProfile={goToProfile}
          selectedInterestFilter={isAdmin ? selectedInterestFilter : undefined}
          onInterestFilterChange={isAdmin ? setSelectedInterestFilter : undefined}
        />
      )}
      {canRenderResult && (
        <Result
          isCorrect={isCorrect}
          tip={currentQuizQuestion.tip}
          nextQuestion={nextQuestion}
        />
      )}
      {step === 'profile' && (() => {
        // Verifica se há userId no estado ou no localStorage
        let profileUserId = userId;
        let profileUserName = username;
        
        if (!profileUserId || !profileUserName) {
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            try {
              const userData = JSON.parse(currentUser);
              if (userData.id && userData.name) {
                profileUserId = userData.id;
                profileUserName = userData.name;
                // Atualiza o estado
                if (!userId) setUserId(userData.id);
                if (!username) setUsername(userData.name);
              }
            } catch (error) {
              console.error('Erro ao recuperar dados do usuário:', error);
            }
          }
        }
        
        if (!profileUserId || !profileUserName) {
          return null;
        }
        
        return (
          <UserProfile
            key={`profile-${profileUserId}`}
            userId={profileUserId}
            userName={profileUserName}
            onPlay={async () => {
            if (isAdmin) {
              setShuffledQuizQuestions(getAllQuestions());
            } else {
              const savedInterests = await getSavedInterests();
              setShuffledQuizQuestions(getRandomQuestions(10, savedInterests));
            }
            setQuestionIndex(0);
            setScore(0);
            setIsCorrect(null);
            setStep('quiz');
          }}
          onLogout={resetAll}
          onUserNameUpdate={(newName) => {
            setUsername(newName);
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
              const userData = JSON.parse(currentUser);
              userData.name = newName;
              localStorage.setItem('currentUser', JSON.stringify(userData));
            }
          }}
        />
        );
      })()}
      {step === 'end' && (
        <Completion
          score={score}
          total={shuffledQuizQuestions.length}
          setStep={setStep}
          resetQuiz={resetQuiz}
          resetAll={resetAll}
          goToProfile={goToProfile}
        />
      )}
    </div>
  );
};

export default SimuladorAntiGolpes;
