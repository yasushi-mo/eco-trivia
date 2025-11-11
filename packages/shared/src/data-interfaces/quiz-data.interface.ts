// --- データベースモデルのインターフェース ---
// アプリケーション内でやり取りされるデータそのものの静的な構造（型）を定義

/**
 * クイズモデル (Quizzes) の基本データ構造
 */
export interface IQuiz {
  id: number;
  question_text: string;
  answer: string;
  question_type: string; // 例: 'multiple_choice', 'true_false'
  created_at: Date;
  updated_at: Date;
}

/**
 * トリビア（解説）モデル (Trivia) のデータ構造
 */
export interface ITrivia {
  id: number;
  explanation_text: string;
  quiz_id: number; // 外部キー
  created_at: Date;
  updated_at: Date;
}

/**
 * タグモデル (Tags) のデータ構造
 */
export interface ITag {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

// --- リレーションを含む複合データ構造 ---

/**
 * フロントエンドに渡す、リレーションを含む完全なクイズデータ構造
 */
export interface IQuizWithTriviaAndTags extends IQuiz {
  trivia: ITrivia; // 1:1 のリレーション
  tags: ITag[]; // 多:多 のリレーション (中間テーブル QuizTags を経由)
}

// --- APIレスポンス用のインターフェース (回答を含まない) ---

/**
 * /quiz/today など、クイズ提供APIのレスポンス形式
 * (セキュリティのため、正解 `answer` は含めない)
 */
export interface IQuizResponse {
  id: number;
  question_text: string;
  question_type: string;
  tags: ITag[];
  // 回答に関する情報は含めない
}
