export interface QuizService {
  gradeAnswer(
    questionId: string,
    answer: unknown
  ): Promise<{ correct: boolean; explanation: string }>;
}

// TODO(quiz): Replace with a quiz engine that supports attempts, hints, scoring, and review mode.
export const quizServicePlaceholder: QuizService = {
  async gradeAnswer() {
    throw new Error("Quiz engine is not implemented in the local mock MVP.");
  }
};
