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

  // Se não há interesses selecionados, retorna aleatório simples
  if (selectedInterests.length === 0) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  // Classifica perguntas por relevância aos interesses
  const questionsWithScores = questions.map(question => ({
    question,
    score: getQuestionRelevanceScore(question, selectedInterests)
  }));

  // Separa em grupos: relacionadas e não relacionadas
  const relatedQuestions = questionsWithScores
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.question);

  const unrelatedQuestions = questionsWithScores
    .filter(item => item.score === 0)
    .map(item => item.question);

  // Embaralha cada grupo
  const shuffledRelated = [...relatedQuestions].sort(() => 0.5 - Math.random());
  const shuffledUnrelated = [...unrelatedQuestions].sort(() => 0.5 - Math.random());

  // Prioriza perguntas relacionadas: 70% relacionadas, 30% não relacionadas
  const relatedCount = Math.min(
    Math.ceil(count * 0.7),
    shuffledRelated.length
  );
  const unrelatedCount = Math.min(
    count - relatedCount,
    shuffledUnrelated.length
  );

  const selected = [
    ...shuffledRelated.slice(0, relatedCount),
    ...shuffledUnrelated.slice(0, unrelatedCount)
  ];

  // Embaralha o resultado final para misturar as categorias
  return selected.sort(() => 0.5 - Math.random());
}