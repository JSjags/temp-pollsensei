interface Question {
  question: string;
  description?: string;
  question_type: string;
  is_required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  rows?: string[];
  columns?: string[];
  can_accept_media?: boolean;
}

export type { Question };
