import jsonData from './questions.json';

export interface QuestionType {
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  correct: string;
  tip: string;
  interests?: string[]; // Array de interesses relacionados à pergunta
}

export const questions: QuestionType[] = jsonData as QuestionType[];

// Função para calcular o score de relevância de uma pergunta baseado nos interesses
// Agora usa a propriedade interests diretamente da pergunta
function getQuestionRelevanceScore(question: QuestionType, selectedInterests: string[]): number {
  if (selectedInterests.length === 0 || !question.interests || question.interests.length === 0) {
    return 0;
  }
  
  // Conta quantos interesses selecionados correspondem aos interesses da pergunta
  return question.interests.filter(interest => selectedInterests.includes(interest)).length;
}

export function getAllQuestions(): QuestionType[] {
  return questions;
}

export function getRandomQuestion(): QuestionType | null {
  if (!questions || questions.length === 0) {
    console.warn("Nenhuma pergunta encontrada no arquivo JSON ou o arquivo está vazio.");
    return null;
  }
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

export function getRandomQuestions(count: number, selectedInterests: string[] = []): QuestionType[] {
  if (!questions || questions.length === 0) {
    return [];
  }

  // Se não há interesses selecionados (ou "Todos" foi selecionado), retorna todas as questões aleatórias
  if (selectedInterests.length === 0) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  // Filtra APENAS questões que tenham pelo menos um dos interesses selecionados
  const filteredQuestions = questions.filter(question => {
    // Se a questão não tem interesses definidos, não inclui
    if (!question.interests || question.interests.length === 0) {
      return false;
    }
    
    // Verifica se a questão tem pelo menos um interesse que corresponde aos selecionados
    return question.interests.some(interest => selectedInterests.includes(interest));
  });

  // Se não há questões filtradas, retorna vazio (ou poderia retornar todas como fallback)
  if (filteredQuestions.length === 0) {
    return [];
  }

  // Embaralha as questões filtradas e retorna o número solicitado
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}