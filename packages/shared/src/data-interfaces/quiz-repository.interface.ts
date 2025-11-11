import { IQuizWithTriviaAndTags } from "@eco-trivia/shared/data-interfaces/quiz-data.interface";

// --- データアクセス層（Repository）のインターフェース ---
// 「データベース（永続層）に対してどのような操作ができるか」という規約を定義

/**
 * クイズデータへのアクセス操作を定義するインターフェース
 */
export interface IQuizRepository {
  /**
   * すべてのクイズIDのリストを取得します。
   * @returns クイズIDの配列
   */
  findAllQuizIds(): Promise<number[]>;

  /**
   * 指定されたIDのクイズを、関連するトリビアやタグと一緒に取得します。
   * @param id 取得するクイズのID
   * @returns クイズデータ（トリビア、タグを含む）
   */
  findQuizById(id: number): Promise<IQuizWithTriviaAndTags | null>;

  /**
   * 指定されたクイズのIDから正解を取得します。（サービス層で使用）
   * @param id クイズのID
   * @returns 正解文字列
   */
  findAnswerById(id: number): Promise<string | null>;
}
