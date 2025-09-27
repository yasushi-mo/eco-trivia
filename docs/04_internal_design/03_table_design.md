# エコ・トリビア アプリ テーブル設計書

この設計書は、データベースの技術選定として PostgreSQL、ORM として Prisma を使用することを前提としています。

## テーブル一覧

- `Quizzes`（クイズ）
- `Trivia`（トリビア）
- `Tags`（タグ）
- `QuizTags`（クイズとタグの関連付け）

## テーブル詳細

### `Quizzes` テーブル（クイズ）

| カラム名        | データ型    | 制約                    | 説明                                        |
| :-------------- | :---------- | :---------------------- | :------------------------------------------ |
| `id`            | SERIAL      | PRIMARY KEY             | クイズを一意に識別する ID。自動採番。       |
| `question_text` | TEXT        | NOT NULL                | クイズの問題文。                            |
| `answer`        | TEXT        | NOT NULL                | クイズの正解。                              |
| `question_type` | TEXT        | NOT NULL                | クイズ形式 (`'4-choice'`, `'true-false'`)。 |
| `created_at`    | TIMESTAMPTZ | NOT NULL, DEFAULT now() | レコード作成日時。                          |
| `updated_at`    | TIMESTAMPTZ | NOT NULL, DEFAULT now() | レコード更新日時。                          |

### `Trivia` テーブル（トリビア）

| カラム名           | データ型    | 制約                          | 説明                                                 |
| :----------------- | :---------- | :---------------------------- | :--------------------------------------------------- |
| `id`               | SERIAL      | PRIMARY KEY                   | トリビアを一意に識別する ID。自動採番。              |
| `explanation_text` | TEXT        | NOT NULL                      | トリビアの解説文。                                   |
| `quiz_id`          | INTEGER     | NOT NULL, UNIQUE, FOREIGN KEY | 関連するクイズの ID。`Quizzes`テーブルの`id`を参照。 |
| `created_at`       | TIMESTAMPTZ | NOT NULL, DEFAULT now()       | レコード作成日時。                                   |
| `updated_at`       | TIMESTAMPTZ | NOT NULL, DEFAULT now()       | レコード更新日時。                                   |

### `Tags` テーブル（タグ）

| カラム名     | データ型    | 制約                    | 説明                                            |
| :----------- | :---------- | :---------------------- | :---------------------------------------------- |
| `id`         | SERIAL      | PRIMARY KEY             | タグを一意に識別する ID。自動採番。             |
| `name`       | TEXT        | NOT NULL, UNIQUE        | タグの名前 (`'食料'`, `'水'`, `'エネルギー'`)。 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | レコード作成日時。                              |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | レコード更新日時。                              |

### `QuizTags` テーブル（クイズとタグの関連付け）

| カラム名  | データ型 | 制約                     | 説明                                                 |
| :-------- | :------- | :----------------------- | :--------------------------------------------------- |
| `quiz_id` | INTEGER  | PRIMARY KEY, FOREIGN KEY | 関連するクイズの ID。`Quizzes`テーブルの`id`を参照。 |
| `tag_id`  | INTEGER  | PRIMARY KEY, FOREIGN KEY | 関連するタグの ID。`Tags`テーブルの`id`を参照。      |
