import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 全ワークスペースに適用される共通設定
    globals: true, // `describe`, `it`, `expect`などをグローバルで利用可能にする
    reporters: "verbose", // 詳細なテストレポートを出力
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },

    testTimeout: 10000, // ネットワーク操作を考慮し、テストタイムアウトを長めに設定

    // テスト中にコンソールに出力されたメッセージを非表示にしない
    silent: false,
  },
});
