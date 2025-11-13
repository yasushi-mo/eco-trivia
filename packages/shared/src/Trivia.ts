/**
 * @fileoverview Trivia データモデルの型定義。
 * PrismaスキーマのTriviaモデルに対応し、バックエンドとフロントエンド間の
 * データ整合性を保つために使用される。
 */

/**
 * Triviaテーブルのレコードを表す型。
 * データベースの物理構造と一致する。
 */
export type Trivia = {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * API経由でフロントエンドに公開されるデータの型。
 * createdAtとupdatedAtは除外される。
 */
export type TriviaDto = Omit<Trivia, "createdAt" | "updatedAt">;

/**
 * ランダム取得APIが返すレスポンスの型。
 */
export type RandomTriviaResponse = {
  /**
   * 取得されたトリビアデータ。
   */
  trivia: TriviaDto;
};
