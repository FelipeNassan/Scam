// Serviço para rastrear estatísticas de respostas individuais das perguntas

export interface QuestionAnswer {
  questionText: string;
  selectedOption: string;
  isCorrect: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'questionAnswers';

// Gera um hash simples baseado no texto da pergunta
function getQuestionId(questionText: string): string {
  // Usa o texto da pergunta como ID (pode ser melhorado com hash)
  return questionText.trim().toLowerCase();
}

// Salva uma resposta individual
export function saveQuestionAnswer(questionText: string, selectedOption: string, correctAnswer: string): void {
  try {
    const answers: QuestionAnswer[] = getStoredAnswers();
    const newAnswer: QuestionAnswer = {
      questionText,
      selectedOption,
      isCorrect: selectedOption === correctAnswer,
      timestamp: Date.now(),
    };
    answers.push(newAnswer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
  }
}

// Obtém todas as respostas armazenadas
function getStoredAnswers(): QuestionAnswer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao ler respostas:', error);
    return [];
  }
}

// Obtém estatísticas de uma pergunta específica
export interface QuestionStats {
  questionText: string;
  totalAnswers: number;
  answersByOption: Record<string, number>;
  correctAnswers: number;
  incorrectAnswers: number;
}

export function getQuestionStats(questionText: string): QuestionStats {
  const answers = getStoredAnswers();
  const questionId = getQuestionId(questionText);
  
  // Filtra respostas para esta pergunta específica
  const questionAnswers = answers.filter(
    (answer) => getQuestionId(answer.questionText) === questionId
  );

  const answersByOption: Record<string, number> = {};
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  questionAnswers.forEach((answer) => {
    // Conta respostas por opção
    answersByOption[answer.selectedOption] = (answersByOption[answer.selectedOption] || 0) + 1;
    
    // Conta acertos e erros
    if (answer.isCorrect) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
  });

  return {
    questionText,
    totalAnswers: questionAnswers.length,
    answersByOption,
    correctAnswers,
    incorrectAnswers,
  };
}

// Limpa todas as respostas (útil para testes)
export function clearAllAnswers(): void {
  localStorage.removeItem(STORAGE_KEY);
}

