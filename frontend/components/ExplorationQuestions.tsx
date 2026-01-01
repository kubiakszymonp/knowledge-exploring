import { ChevronDown } from "lucide-react";

interface QuestionOption {
  id: string;
  teaser: string;
}

interface ExplorationQuestionsProps {
  questions: QuestionOption[];
  onSelectQuestion: (id: string) => void;
  loadingQuestionId: string | null;
}

export function ExplorationQuestions({
  questions,
  onSelectQuestion,
  loadingQuestionId,
}: ExplorationQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-stone-200">
      <div className="flex items-center gap-2 mb-6">
        <ChevronDown className="w-5 h-5 text-amber-500" />
        <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">
          Czytaj dalej
        </span>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelectQuestion(q.id)}
            disabled={loadingQuestionId !== null}
            className="w-full text-left p-4 rounded-lg bg-white border border-stone-200 
                       hover:border-amber-400 hover:bg-amber-50/50 
                       transition-all duration-200 group
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg text-stone-700 group-hover:text-amber-700 transition-colors">
              {q.teaser}
            </span>
            {loadingQuestionId === q.id && (
              <span className="ml-2 text-amber-500 animate-pulse">...</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}




