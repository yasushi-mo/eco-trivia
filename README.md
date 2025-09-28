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
