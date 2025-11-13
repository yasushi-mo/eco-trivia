# エコ・トリビア アプリ アーキテクチャ設計書

## 1. 全体概要

エコ・トリビアアプリは、ユーザーインターフェース、ビジネスロジック、データアクセスの責務を明確に分離した**3 層アーキテクチャ**を採用します。全コンポーネントはTypeScriptを使用し、モノレポの`npm workspaces`で管理されます。

- **フロントエンド**: React
- **バックエンド**: Express.js (TypeScript)
- **データベース**: PostgreSQL
- **ホスティング**: Render

---

## 2. 各層のコンポーネントと役割

### 2.1. プレゼンテーション層 (Frontend)

ユーザーが直接操作するクライアント側のUI層です。

- **役割**: UI の表示と状態管理、ユーザーの操作受付（「次のトリビアへ」ボタン）、バックエンド API へのリクエスト送信。
- **技術**: React (TypeScript)
- **ホスティング先**: Render (Static Site)
- **主要コンポーネント**:
    - **TriviaViewer**: メインの単一コンポーネント。トリビアテキストとボタンを表示し、データの取得状況（ロード中など）を管理します。

### 2.2. ビジネスロジック層 (Backend - Service & Controller)

フロントエンドからのリクエスト処理と、アプリケーション固有のロジックを担う層です。

- **役割**: リクエストのルーティング、リクエストデータの検証、**ランダムにトリビアを取得する**処理の実行指示。
- **技術**: Express.js (TypeScript)
- **ホスティング先**: Render (Web Service)
- **主要コンポーネント**:
    - **TriviaController**: APIエンドポイント（例: `/api/trivia/random`）を定義し、リクエストを**TriviaService**に受け渡します。
    - **TriviaService**: コントローラーとリポジトリの間を仲介し、ビジネスルール（ここではランダム取得の指示）を実行します。

### 2.3. データアクセス層 (Backend - Repository)

データベースとの通信を専門的に行う層です。この層は**バックエンド（Express.js）内**に存在します。

- **役割**: データベース（PostgreSQL）に対するCRUD操作（データの読み書き）の実装。ビジネスロジック層がデータベースの詳細（SQLやPrisma）を知る必要がないように抽象化します。
- **技術**: Prisma ORM (TypeScript)
- **主要コンポーネント**:
    - **TriviaRepository**: `TriviaService`からの要求を受け、Prismaを用いて**データベースからランダムなトリビアレコードを一件取得**する具体的なロジックを実装します。

---

## 3. データの流れ（API 設計の概要）

1.  **TriviaViewer (Frontend)** がロード時またはボタン押下時に、APIエンドポイント `/api/trivia/random` にリクエストを送信します。
2.  **TriviaController (Backend)** がリクエストを受け取ります。
3.  **TriviaService (Backend)** が呼び出され、ランダム取得の指示を出します。
4.  **TriviaRepository (Backend)** がPrismaを通じてPostgreSQLにクエリを発行し、ランダムなトリビアデータを一件取得します。
5.  取得データがService、Controllerを経由してフロントエンドに JSON 形式で返送され、**TriviaViewer**が画面を更新します。
