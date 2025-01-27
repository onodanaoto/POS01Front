FROM node:20-slim AS builder

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# 本番用ビルド
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://tech0-gen8-step4-pos-app-78.azurewebsites.net
RUN npm run build

# 本番環境用のイメージ
FROM node:20-slim

WORKDIR /app

# 本番環境の依存関係のみをコピー
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# ビルド成果物をコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 環境変数の設定
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

EXPOSE 3000

# アプリケーションの起動
CMD ["npm", "start"]
