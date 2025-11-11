import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

/**
 * React + TypeScript 環境のための ESLint Flat Config 設定ファイル (v2)
 *
 * モノレポ構造と型情報に基づくLint (Typed Linting) に対応しています。
 */
export default [
  // -----------------------------------------------------------
  // 1. 無視するファイル/ディレクトリの設定
  // -----------------------------------------------------------
  {
    // ビルド出力、依存関係、設定ファイル、そして生成されたPrismaクライアントファイルを無視
    ignores: [
      "dist/",
      "node_modules/",
      "*.config.js",
      "*.config.cjs",
      // 生成されたPrismaクライアントファイルを無視
      "packages/backend/generated/",
    ],
  },

  // -----------------------------------------------------------
  // 2. 標準的なJavaScriptルールと環境設定
  // -----------------------------------------------------------
  // ESLintのベース推奨ルールを適用
  js.configs.recommended,

  {
    // すべての対象ファイルに適用
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      // ブラウザ環境のグローバル変数を有効化
      globals: globals.browser,
    },
    // その他の共通ルール
    rules: {
      semi: ["error", "always"],
    },
  },

  // -----------------------------------------------------------
  // 3. TypeScript設定 (ts-eslint)
  // -----------------------------------------------------------
  // TypeScript-ESLintの推奨設定を適用
  ...tseslint.configs.recommended,

  {
    // TypeScript/TSXファイルのみを対象
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      // TypeScriptファイルを解析するためのパーサーを指定
      parser: tseslint.parser,
      parserOptions: {
        // MonorepoやProject References環境でのエラーを回避するため、
        // Language Serviceを利用して適切なtsconfigを自動で検出する
        projectService: true, // <-- ★ここを修正しました
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // JSの`no-unused-vars`を無効化し、TSの同等ルールを有効化
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // -----------------------------------------------------------
  // 4. React設定 (eslint-plugin-react)
  // -----------------------------------------------------------
  {
    // JSX/TSXファイルのみを対象
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: react,
    },
    settings: {
      // Reactのバージョンを自動検出 (ワーニング解消)
      react: {
        version: "detect",
      },
    },
    rules: {
      // Reactプラグインの推奨ルールを適用
      ...react.configs.recommended.rules,

      // React 17+の新しいJSXトランスフォーム (jsx-runtime) に対応
      ...react.configs["jsx-runtime"].rules,

      // target="_blank" を使用する場合は rel="noreferrer" を強制 (セキュリティのため)
      "react/jsx-no-target-blank": "error",
    },
  },
];
