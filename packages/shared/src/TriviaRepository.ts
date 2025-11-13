/**
 * @fileoverview TriviaRepositoryのコントラクト定義（TriviaRepositoryという型が満たすべき機能の取り決め）
 * データアクセス層（Repository）の契約を定義する。
 * ビジネスロジック層は、この型を通じてデータベース操作を実行し、
 * 具体的な実装（Prismaなど）から分離される。
 */

import { Trivia } from "@eco-trivia/shared/src/Trivia";

/**
 * Triviaデータへのアクセス機能を提供するリポジトリの型定義。
 * プロジェクトの型定義の慣習に従い、'type'エイリアスとして定義される。
 */
export type TriviaRepository = {
  /**
   * データベースからランダムなトリビアレコードを一件取得する。
   *
   * @returns 取得したTriviaオブジェクト、または見つからなかった場合はnull。
   */
  getRandomTrivia(): Promise<Trivia | null>;
};
