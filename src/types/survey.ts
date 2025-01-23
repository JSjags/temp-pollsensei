interface Question {
  question: string;
  description?: string;
  question_type: string;
  is_required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  can_accept_media?: boolean;
  rows?: string[];
  columns?: string[];
  step?: number;
}

export type { Question };
