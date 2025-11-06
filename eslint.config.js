import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

/**
 * 1. TypeScript プロジェクト全体に型チェックを適用するための設定
 * tseslint.config() の呼び出しを外し、設定オブジェクトの配列として結合する
 */
const tsBaseConfig = {
  files: ["**/*.{ts,tsx}"], // 対象ファイルをTypeScriptに限定
  parserOptions: {
    project: true, // tsconfig.json の references を使用
    tsconfigRootDir: import.meta.dirname, // ルートを起点とする
  },
  // 型情報を使用した推奨ルールセットを適用
  extends: [...tseslint.configs.recommendedTypeChecked],
  // TypeScriptファイル内でブラウザAPIのグローバルを許可
  // window、document、setTimeout、fetch などの、ブラウザが提供するグローバルなオブジェクトや関数を使っても、型エラーや「未定義の変数です」というエラーを出さないようにする
  languageOptions: {
    globals: globals.browser,
  },
  rules: {
    // TypeScriptの強力なルールを上書き・追加
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // 未使用変数のルール
  },
};

export default [
  // ----------------------------------------------------
  // I. グローバル設定
  // ----------------------------------------------------
  {
    // ESLintが無視するファイルやディレクトリを定義
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/*.tsbuildinfo",
      "coverage",
      "build",
      ".prettierignore",
    ],
  },

  // ----------------------------------------------------
  // II. 基本ルールとTSルール
  // ----------------------------------------------------
  // 1. JavaScriptの推奨ルール
  pluginJs.configs.recommended,

  // 2. TypeScript（型チェック付き）をプロジェクト全体に適用
  tsBaseConfig,

  // 3. Prettierとの連携 (最も最後に配置し、整形ルールをすべて無効化)
  prettierConfig,

  // ----------------------------------------------------
  // III. ワークスペース固有の設定
  // ----------------------------------------------------

  // 4. React / Frontend固有の設定
  {
    files: ["packages/frontend/**/*.{ts,tsx}"], // frontend フォルダ内のみ適用
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Reactの推奨ルールを適用
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // 5. Backend / Shared固有の設定 (Node.jsのグローバルを許可)
  {
    files: ["packages/{backend,shared}/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.node, // 'process', 'Buffer' などのNode.jsグローバルを許可
    },
  },
];
