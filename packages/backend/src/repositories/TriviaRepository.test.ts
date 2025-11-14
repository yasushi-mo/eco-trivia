import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  TriviaRepository,
  PrismaClientSubset,
} from "@eco-trivia/backend/src/repositories/TriviaRepository";
import { Trivia } from "@eco-trivia/shared/src/Trivia";

// Math.randomをモック化するためのspy
let mathRandomSpy: ReturnType<typeof vi.spyOn>;

// テスト用のダミーデータ (Prismaの生成型をシミュレート)
const MOCK_TRIVIA_LIST: Trivia[] = [
  {
    id: 1,
    text: "地球上の水のうち、真水はわずか約2.5%です。",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    text: "日本のフードロスは年間約522万トンで、世界全体の食料援助量に匹敵します。",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    text: "LED電球は白熱電球よりも寿命が約40倍長く、省エネ効果が高いです。",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    text: "リサイクルされたアルミ缶は、新品を作るより95%のエネルギーを節約できます。",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    text: "世界で最も多くリサイクルされているのは、ガラスではなく、鉄です。",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const TOTAL_COUNT = MOCK_TRIVIA_LIST.length;

describe("TriviaRepository", () => {
  // PrismaClientSubsetのモックオブジェクトを定義
  let mockPrisma: PrismaClientSubset;
  let repository: TriviaRepository;

  beforeEach(() => {
    // Math.randomをスパイし、テストケースごとにリセット
    // これにより、ランダムな処理を予測可能にする
    mathRandomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

    // モックPrismaオブジェクトを初期化
    mockPrisma = {
      trivia: {
        // count()は常に総数を返すようにモック
        count: vi.fn().mockResolvedValue(TOTAL_COUNT),
        // findFirst()は具体的なテストケースでモック実装を上書きする
        findFirst: vi.fn().mockResolvedValue(MOCK_TRIVIA_LIST[0]),
      },
    };

    // リポジトリにモックを注入
    repository = new TriviaRepository(mockPrisma);
  });

  afterEach(() => {
    // 全てのスパイとモックをクリーンアップ
    vi.clearAllMocks();
  });

  // --- findRandom() のテスト ---
  describe("findRandom", () => {
    it("データベースからランダムに一件のトリビアを取得できること", async () => {
      // 準備：
      // totalCount = 5
      // Math.random() は 0.5 を返す
      // randomIndex = Math.floor(0.5 * 5) = 2

      // findFirstが skip: 2 で呼び出され、MOCK_TRIVIA_LIST[2]（id: 3）を返すように設定
      const expectedTrivia = MOCK_TRIVIA_LIST[2];
      (
        mockPrisma.trivia.findFirst as ReturnType<typeof vi.fn>
      ).mockResolvedValue(expectedTrivia);

      // 実行
      const result = await repository.findRandom();

      // 検証
      expect(mockPrisma.trivia.count).toHaveBeenCalledOnce();
      expect(mockPrisma.trivia.findFirst).toHaveBeenCalledWith({ skip: 2 }); // 正しいオフセットで呼び出されているか
      expect(result).toEqual(expectedTrivia);
    });

    it("Math.randomの値が0に近い場合（最小オフセット）でも正しく動作すること", async () => {
      // 準備：
      // totalCount = 5
      mathRandomSpy.mockReturnValue(0.01); // 0に近い値を返す

      // randomIndex = Math.floor(0.01 * 5) = 0
      const expectedTrivia = MOCK_TRIVIA_LIST[0];
      (
        mockPrisma.trivia.findFirst as ReturnType<typeof vi.fn>
      ).mockResolvedValue(expectedTrivia);

      // 実行
      const result = await repository.findRandom();

      // 検証
      expect(mockPrisma.trivia.findFirst).toHaveBeenCalledWith({ skip: 0 });
      expect(result).toEqual(expectedTrivia);
    });

    it("Math.randomの値が1に近い場合（最大オフセット）でも正しく動作すること", async () => {
      // 準備：
      // totalCount = 5
      mathRandomSpy.mockReturnValue(0.99); // 1に近い値を返す

      // randomIndex = Math.floor(0.99 * 5) = 4 (totalCount - 1)
      const expectedTrivia = MOCK_TRIVIA_LIST[4];
      (
        mockPrisma.trivia.findFirst as ReturnType<typeof vi.fn>
      ).mockResolvedValue(expectedTrivia);

      // 実行
      const result = await repository.findRandom();

      // 検証
      expect(mockPrisma.trivia.findFirst).toHaveBeenCalledWith({ skip: 4 });
      expect(result).toEqual(expectedTrivia);
    });

    it("レコードが一件も見つからなかった場合（totalCount = 0）、nullを返すこと", async () => {
      // 準備：
      (mockPrisma.trivia.count as ReturnType<typeof vi.fn>).mockResolvedValue(
        0,
      );

      // 実行
      const result = await repository.findRandom();

      // 検証
      expect(mockPrisma.trivia.count).toHaveBeenCalledOnce();
      expect(mockPrisma.trivia.findFirst).not.toHaveBeenCalled(); // countが0の場合、findFirstは呼ばれないこと
      expect(result).toBeNull();
    });

    it("データベースエラーが発生した場合、エラーを上位層へスローすること", async () => {
      // 準備：
      const mockError = new Error("Database connection failed");
      (mockPrisma.trivia.count as ReturnType<typeof vi.fn>).mockRejectedValue(
        mockError,
      );

      // 実行と検証
      // findRandom() がエラーをスローすることを期待
      await expect(() => repository.findRandom()).rejects.toThrow(mockError);

      // findFirstは呼ばれないこと
      expect(mockPrisma.trivia.findFirst).not.toHaveBeenCalled();
    });

    it("findFirstがnullを返した場合（稀なケース）、nullを返すこと", async () => {
      // 準備：
      // countは > 0 だが、findFirstがなぜかnullを返したと仮定
      (
        mockPrisma.trivia.findFirst as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      // 実行
      const result = await repository.findRandom();

      // 検証
      expect(mockPrisma.trivia.count).toHaveBeenCalledOnce();
      expect(mockPrisma.trivia.findFirst).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
