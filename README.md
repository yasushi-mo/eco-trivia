# 開発環境構築ガイド (DEV.md)

エコ・トリビア アプリケーションの開発環境をセットアップし、基本的な開発タスク（Docker、データベース、起動）を実行するための総合的なガイド。

## 1. はじめに

本プロジェクトは、npm workspaces を使用したモノレポ構成を採用しています。すべての開発コマンドは、ルートディレクトリで実行することを原則とします。

## 2. 前提条件

以下のツールがローカル環境にインストールされ、正しく動作している必要があります。

- Node.js: 24.11.0 (LTS推奨)
- npm: 11.6.2
- Git: ソースコード管理用
- Docker および Docker Compose: データベースおよびローカル実行環境用
- Volta: (オプション) package.json で定義された上記バージョンを自動で管理・適用するために推奨されます。

## 3. セットアップ手順

### 3.1 リポジトリのクローンと依存関係のインストール

```
# GitHubからリポジトリをクローン
git clone git@github.com:yasushi-mo/eco-trivia.git
cd eco-trivia

# モノレポ全体の依存関係をインストール
npm install
```

### 3.2 環境変数の設定

プロジェクトルートに .env ファイルを作成し、以下の環境変数を定義します。

```
# .env

# --- データベース設定（Docker Composeで使用） ---

POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=eco_trivia_db

# --- データベース接続URL (PrismaとBackendが使用) ---

# DBホスト名として 'db' (Docker Composeサービス名) を指定

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"

# --- アプリケーション設定 ---

# バックエンドAPIのポート

PORT=8080

# VITE_PUBLIC_BACKEND_URL=http://localhost:${PORT}
```

### 3.3 Dockerコンテナの起動

データベースコンテナ（db）と、Node.js開発コンテナ（app）を起動します。

```
# データベース (PostgreSQL) とNode.jsコンテナをバックグラウンドで起動

docker compose up -d
```

コンテナが起動していることを確認してください (`docker compose ps`)。

## 4. データベースの初期設定（Prisma）

データベースコンテナが起動した後、バックエンドパッケージ内でPrismaのセットアップを行います。

### 4.1 Prismaクライアントの生成とマイグレーションの実行

PrismaがDBにアクセスするために、スキーマを定義し、マイグレーションを実行します。

```
# バックエンドパッケージに移動

cd packages/backend

# Prismaクライアントコードを生成

# Note: Prismaスキーマファイル（2.1.1で作成予定）が必要です。

npx prisma generate

# ローカルDBにマイグレーションを適用（初回設定時）

# このコマンドは、スキーマに基づいてテーブルを作成します。

npx prisma migrate dev --name init

# ルートディレクトリに戻る

cd ../..
```

## 5. 開発サーバーの起動

Dockerコンテナ内のNode.js環境で、フロントエンドとバックエンドの各開発サーバーを起動します。

### 5.1 バックエンドサーバーの起動

APIサーバー (packages/backend) を起動します。

```
# ルートからnpm workspacesの構文を使用してバックエンドを起動

npm run dev --workspace backend
```

アクセス: `http://localhost:8080/`

### 5.2 フロントエンドサーバーの起動

Reactアプリケーション (packages/frontend) を起動します。

```
# ルートからnpm workspacesの構文を使用してフロントエンドを起動

npm run dev --workspace frontend
```

アクセス: `http://localhost:5173/`

# ディレクトリ構造

```
/eco-trivia
├── packages/
│   ├── frontend/  # Reactアプリケーション（App）
│   ├── backend/   # Expressサーバー（App）
│   └── shared/    # 共通の型定義やユーティリティ（Library/Package）
└── package.json   # ルートのpackage.json
```

※npm workspaces の仕組み上、frontend、backend、shared の全てを workspaces フィールドが認識できる packages ディレクトリ内に配置することが、設定のシンプルさと一貫性を保つ上で最も効果的です。shared は他のパッケージから参照される内部ライブラリとして機能します。

# 開発用と本番用 Dockerfile を分けるメリット

## 1. 開発体験（Developer Experience）の最適化

開発コンテナの最大の目的は、開発者が快適に作業できることです。

- **ホットリロードの実現**: `Dockerfile.dev` では、コードの変更を即座に反映させるため、ホスト側のコードをコンテナ内の作業ディレクトリに **Volume Mount** しています。これにより、コンテナを再起動せずに開発が可能です。
  - 本番用 `Dockerfile` は通常、このマウントを行わず、コンテナ内に静的なビルド成果物を配置します。
- **デバッグツールの搭載**: 開発時に必要な `git` や `vim`、特定のデバッグライブラリなどのツールを `Dockerfile.dev` にのみインストールすることで、本番コンテナのイメージサイズを不必要に大きくするのを防ぎます。

## 2. 本番環境の最適化とセキュリティ

本番コンテナの目的は、**最小限のサイズと最大のセキュリティ**でアプリケーションを実行することです。

- **マルチステージビルド**: 本番用 `Dockerfile` では、通常「ビルドステージ」と「ランタイムステージ」を分離するマルチステージビルドを採用します。
  - `Dockerfile.dev` は開発サーバーの実行を目的とするため、すべての依存関係を一つのステージにまとめます。
  - 本番用 `Dockerfile` は、`devDependencies` やビルドツールを含まない、非常に小さな最終イメージを作成できます。
- **環境のクリーン化**: 本番環境に不要なファイル（例：テストファイル、`.git`、ドキュメント）をコピーしないことで、攻撃対象領域（Attack Surface）を最小限に抑え、セキュリティを向上させます。

## まとめ

| 違い             | `Dockerfile.dev` (開発用)               | `Dockerfile` (本番用)                 |
| :--------------- | :-------------------------------------- | :------------------------------------ |
| **目的**         | 開発効率とホットリロード                | 最小サイズ、高速起動、セキュリティ    |
| **実装**         | **Volume Mount** でホストと同期         | **マルチステージビルド**でサイズ削減  |
| **含まれるもの** | すべてのソースコード、`devDependencies` | 最終ビルド成果物、`dependencies` のみ |

プロジェクトの初期段階であるため、まずは開発しやすい環境を `Dockerfile.dev` で構築しました。ご指摘いただいた通り、本番環境との差異を防ぐため、タスク **2.1.4** で、開発が進んだらすぐに本番用 `Dockerfile` を作成する計画としています。

# 関連リンク

- [tsconfig.json の設定内容について](https://github.com/yasushi-mo/eco-trivia/pull/8)
