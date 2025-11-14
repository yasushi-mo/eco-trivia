import { defineConfig } from "vitest/config";

// @eco-trivia/backend パッケージ専用のVitest設定
// ルートの `vitest.config.ts` の設定を継承しつつ、
// パス解決とインクルードをこのパッケージの構造に合わせます。
export default defineConfig({
  test: {
    // グローバル設定はルートから継承されるため、ここでは主に固有のパスを設定

    // テストファイル検索パスをこのパッケージの 'src' 以下に設定
    // ルートからの実行時、Vitestはパッケージのルートを基点にファイルを探します。
    // 「src/**/*.test.ts」とすることで、このパッケージ内のファイルを探します。
    include: ["src/**/*.test.ts"],

    // Node.js環境で実行
    environment: "node",
  },
});
