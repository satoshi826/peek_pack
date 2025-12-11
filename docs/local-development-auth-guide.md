# ローカル開発でのClerk認証テストガイド

## 🔐 ローカル開発での認証方法

### 方法1: テストアカウントでサインイン (推奨)

Clerkは開発環境で簡単にテストできるように、**テストモード**を提供しています。

#### ステップ

1. **アプリにアクセス**
   ```
   http://localhost:3000
   ```

2. **「Sign In」ボタンをクリック**
   - Clerkのサインインモーダルが表示されます

3. **認証方法を選択**

   **オプションA: Googleアカウント**
   - 「Continue with Google」をクリック
   - 自分のGoogleアカウントでサインイン
   - 初回のみ権限を許可

   **オプションB: Emailアドレス**
   - メールアドレスを入力
   - 「Continue」をクリック
   - メールに送られた認証コードを入力

4. **サインイン完了**
   - ページがリロードされ、ユーザー情報が表示されます
   - 「My Collection」セクションが表示されます

---

## 🧪 認証フローのテスト手順

### 1. サインアウト状態の確認

**期待される表示:**
- ✅ 「Sign In」ボタンが表示される
- ✅ 「My Collection」セクションが**表示されない**
- ✅ カメラとレンズのマスターデータは表示される

**確認コマンド:**
```javascript
// ブラウザのコンソールで実行
console.log("Authenticated:", document.querySelector('[data-clerk-loaded]'));
```

---

### 2. サインイン

**手順:**
1. 「Sign In」ボタンをクリック
2. Googleアカウントまたはメールアドレスでサインイン
3. 認証完了を待つ

**期待される動作:**
- ✅ Clerkモーダルが表示される
- ✅ 認証後、モーダルが閉じる
- ✅ ページが自動的にリロードされる

---

### 3. サインイン後の状態確認

**期待される表示:**
- ✅ ユーザーのメールアドレスが表示される
- ✅ 「Sign Out」ボタンが表示される
- ✅ UserButton (プロフィールアイコン) が表示される
- ✅ 「My Collection」セクションが表示される
- ✅ カメラ数とレンズ数が表示される (初回は0)

**確認方法:**
```javascript
// ブラウザのコンソールで実行
// Clerkのユーザー情報を確認
window.Clerk?.user?.emailAddresses[0]?.emailAddress
```

---

### 4. Convex認証の確認

**Convexダッシュボードで確認:**
1. http://127.0.0.1:6790/?d=anonymous-peek_my_pack にアクセス
2. 左メニューから「Logs」を選択
3. サインイン後に何かアクションを実行 (例: コレクションページにアクセス)
4. ログに認証情報が表示されることを確認

**期待されるログ:**
```
[INFO] Query: myGear.getMyCameras
[INFO] User ID: user_xxxxxxxxxxxxx
```

---

### 5. 認証付き機能のテスト

#### 5.1 コレクションページへのアクセス

**手順:**
1. ホームページの「View All →」をクリック
2. `/collection` ページに遷移

**期待される動作:**
- ✅ コレクションページが表示される
- ✅ 「Owned」「Wanted」タブが表示される
- ✅ 「Cameras」「Lenses」タブが表示される
- ✅ 初回は「No cameras in your owned list yet」と表示される

#### 5.2 ギアの追加

**手順:**
1. 「Add Gear」ボタンをクリック
2. `/collection/add` ページに遷移
3. 「Camera」を選択
4. 検索バーに「Sony」と入力
5. リストから「Sony α7 IV」を選択
6. 「Owned」を選択
7. 「Add to Collection」をクリック

**期待される動作:**
- ✅ `/collection` ページにリダイレクト
- ✅ 追加したカメラが表示される
- ✅ カメラ数が1になる
- ✅ リアルタイムで更新される

#### 5.3 リアルタイム更新の確認

**手順:**
1. ブラウザで2つのタブを開く
2. 両方で http://localhost:3000/collection にアクセス
3. 片方のタブでギアを追加
4. もう片方のタブを確認

**期待される動作:**
- ✅ 追加したギアが**自動的に**もう片方のタブにも表示される
- ✅ ページをリロードする必要がない

---

### 6. サインアウト

**手順:**
1. 「Sign Out」ボタンをクリック
2. または UserButton → 「Sign out」をクリック

**期待される動作:**
- ✅ サインアウト状態に戻る
- ✅ 「Sign In」ボタンが表示される
- ✅ 「My Collection」セクションが非表示になる

---

## 🐛 トラブルシューティング

### 問題1: サインインボタンをクリックしても何も起こらない

**原因:** Clerk環境変数が設定されていない

**解決:**
```bash
# .env.localを確認
cat .env.local

# 以下が含まれているか確認
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

**修正後:**
```bash
# Next.js開発サーバーを再起動
# Ctrl+C で停止
pnpm dev
```

---

### 問題2: サインイン後に「Unauthenticated」エラー

**原因:** Convex + Clerk連携が正しく設定されていない

**確認項目:**
1. JWT Templateが作成されているか
   - Clerk Dashboard → JWT Templates → Convex

2. `CLERK_JWT_ISSUER_DOMAIN`が設定されているか
   ```bash
   # .env.localを確認
   grep CLERK_JWT_ISSUER_DOMAIN .env.local
   ```

3. `convex/auth.config.js`が存在するか
   ```bash
   cat convex/auth.config.js
   ```

**修正後:**
```bash
# Convex devサーバーを再起動
# Ctrl+C で停止
npx convex dev
```

---

### 問題3: 「My Collection」が表示されない

**原因:** 認証状態が正しく取得できていない

**確認:**
```javascript
// ブラウザのコンソールで実行
import { useConvexAuth } from "convex/react";
// または
window.Clerk?.user
```

**デバッグ:**
1. ブラウザの開発者ツールを開く (F12)
2. Consoleタブを確認
3. エラーメッセージがないか確認

---

### 問題4: リアルタイム更新が動作しない

**原因:** Convex devサーバーが起動していない

**確認:**
```bash
# Convex devサーバーのログを確認
# ターミナルに以下が表示されているか
✔ Convex functions ready!
```

**修正:**
```bash
# Convex devサーバーを再起動
npx convex dev
```

---

## 📊 認証状態の確認方法

### ブラウザのコンソールで確認

```javascript
// Clerk認証状態
console.log("Clerk User:", window.Clerk?.user);
console.log("Email:", window.Clerk?.user?.emailAddresses[0]?.emailAddress);

// Convex認証状態
// React DevToolsで確認
// useConvexAuth() の返り値を確認
```

### Convexダッシュボードで確認

1. http://127.0.0.1:6790/?d=anonymous-peek_my_pack
2. 「Data」タブ → `userCameras` または `userLenses`
3. 追加したデータの`userId`フィールドを確認
4. Clerk User IDと一致しているか確認

---

## ✅ 正常動作のチェックリスト

### 初期状態 (サインアウト)
- [ ] 「Sign In」ボタンが表示される
- [ ] 「My Collection」セクションが表示されない
- [ ] マスターデータ (カメラ・レンズ一覧) は表示される

### サインイン後
- [ ] ユーザーのメールアドレスが表示される
- [ ] 「Sign Out」ボタンが表示される
- [ ] UserButtonが表示される
- [ ] 「My Collection」セクションが表示される
- [ ] カメラ数とレンズ数が表示される

### コレクション機能
- [ ] `/collection` ページにアクセスできる
- [ ] 「Owned」「Wanted」タブが動作する
- [ ] 「Cameras」「Lenses」タブが動作する
- [ ] `/collection/add` ページにアクセスできる
- [ ] ギアを検索できる
- [ ] ギアを追加できる
- [ ] 追加したギアが表示される

### リアルタイム機能
- [ ] ギア追加時に自動的にUIが更新される
- [ ] 複数タブで同時に更新が反映される

### サインアウト
- [ ] サインアウトできる
- [ ] サインアウト後、初期状態に戻る

---

## 🎯 次のステップ

すべてのチェックリストが完了したら:

1. **ギアを追加してみる**
   - カメラを1-2台追加
   - レンズを1-2本追加
   - 「Owned」と「Wanted」の両方を試す

2. **リアルタイム更新を確認**
   - 2つのブラウザタブで同時に開く
   - 片方で追加、もう片方で自動更新を確認

3. **サインアウト・サインインを繰り返す**
   - データが永続化されているか確認
   - 別のアカウントでサインインしてデータが分離されているか確認

---

## 📝 開発のヒント

### テスト用のダミーデータ

開発中は、Convexダッシュボードから直接データを追加できます:

1. http://127.0.0.1:6790/?d=anonymous-peek_my_pack
2. 「Data」タブ
3. `userCameras` または `userLenses` を選択
4. 「Insert」ボタンでデータを追加

### ログの確認

Convexの関数が正しく実行されているか確認:

1. Convexダッシュボード → 「Logs」
2. リアルタイムでログが表示される
3. エラーがあれば赤色で表示される

### 認証トークンの確認

ブラウザの開発者ツール:

1. Application タブ
2. Cookies → `http://localhost:3000`
3. `__session` や `__clerk_db_jwt` などのCookieを確認

---

これで、ローカル開発環境でClerk認証を使用してアプリをテストできます!
