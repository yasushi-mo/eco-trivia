import { Trivia } from "@eco-trivia/shared/Trivia";

/**
 * @description
 * PrismaClientのうちTriviaRepositoryが必要とする機能のみを抽象化する型
 * これにより、リポジトリが具体的なPrismaClient実装に依存するのを防ぐ
 */
export type PrismaClientSubset = {
  trivia: {
    /** Triviaテーブルの全レコード数を取得 */
    count: () => Promise<number>;
    /** 指定された引数（ここではskip）に基づき、最初のレコードを取得 */
    findFirst: (args: { skip: number }) => Promise<Trivia | null>;
  };
};

export class TriviaRepository {
  /** 依存性注入されたPrismaClient互換オブジェクト */
  private prisma: PrismaClientSubset;

  constructor(prisma: PrismaClientSubset) {
    this.prisma = prisma;
  }

  /**
   * @description
   * データベースからランダムに一件のTriviaレコードを取得します。
   * 全レコード数を取得し、ランダムなオフセットを計算後、
   * そのオフセットで一件スキップして取得するロジックを採用します。
   *
   * NOTE: この方法は、テーブルサイズが非常に大きくなるとパフォーマンス上のボトルネックになる。
   *
   * @returns 見つかった場合はTriviaオブジェクト、見つからなかった場合はnullを返します。
   * @throws データベース接続やクエリ実行に関するエラー
   */
  async findRandom(): Promise<Trivia | null> {
    try {
      // 1. 全レコード数を取得
      const totalCount = await this.prisma.trivia.count();

      if (totalCount === 0) return null;

      // 2. ランダムなオフセットを計算
      // 0 から totalCount - 1 までの整数を生成
      const randomIndex = Math.floor(Math.random() * totalCount);

      // 3. ランダムなオフセットで一件取得（ランダム取得の代用）
      const trivia = await this.prisma.trivia.findFirst({
        skip: randomIndex,
      });

      return trivia;
    } catch (error) {
      // データベースエラーをロギングし、上位層（Service）に伝播させて処理
      console.error("TriviaRepository.findRandom execution failed:", error);
      throw error;
    }
  }
}
