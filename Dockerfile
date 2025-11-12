# ----------------------------------------------------------------------
# Stage 1: "base"
# 全ステージで共通のNode.jsバージョンと作業ディレクトリを定義
# ----------------------------------------------------------------------
FROM node:24.11.0-alpine AS base
WORKDIR /app

# ----------------------------------------------------------------------
# Stage 2: "development" (開発用ステージ)
# 開発に必要な全ての依存関係 (devDependencies) をインストールする
# compose.yaml はこのステージを "target" として参照する
# ----------------------------------------------------------------------
FROM base AS development

# 依存関係をインストールするため、まず設定ファイルをコピー
COPY package.json package-lock.json ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/

# npm install を実行し、Docker(Linux)環境でネイティブ依存関係を正しく解決
RUN npm install

# ソースコードをコピー (compose.yaml の volume で上書きされるが、キャッシュのために配置)
COPY . .

# ----------------------------------------------------------------------
# Stage 3: "builder" (本番ビルド用ステージ)
# 開発用ステージから依存関係を引き継ぎ、本番用ビルドを実行する
# ----------------------------------------------------------------------
FROM development AS builder
# 全てのワークスペースをビルド
RUN npm run build

# ----------------------------------------------------------------------
# Stage 4: "production" (本番実行用ステージ)
# 最終的な実行イメージ。最小限のファイルのみを含む
# ----------------------------------------------------------------------
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app

# 本番実行に必要な package.json のみをコピー
COPY package.json ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/

# 本番に必要な依存関係 (dependencies のみ) をインストール
RUN npm install --omit=dev

# "builder" ステージからビルド済みの成果物のみをコピー
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/frontend/dist ./packages/frontend/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# バックエンドのExpressサーバーを起動
# (packages/backend/package.json の "start" スクリプトを参照)
CMD ["npm", "start", "--workspace=@eco-trivia/backend"]
