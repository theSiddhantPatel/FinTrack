# Product Requirements Document (PRD)

## Product
- Name: FinTrack (working title)
- Type: Personal Finance Web Application
- Version: v1 (MVP)
- Date: 2026-03-08

## 1. Purpose
Build a very simple web app that helps an individual track income and expenses, understand monthly spending, and compare spending against a basic monthly budget.

## 2. Goals
- Let users quickly log transactions with minimal friction.
- Provide a clear monthly financial snapshot (income, expense, net).
- Show top spending categories for awareness.
- Keep UX simple and mobile-friendly.

## 3. Target User
- Individual users managing personal finances manually.
- Users who want simplicity over advanced accounting features.

## 4. Scope
### In Scope (MVP)
- User registration and login (email/password).
- CRUD for transactions (create, read, update, delete).
- Transaction fields: type (income/expense), amount, date, category, note (optional).
- Predefined categories.
- Optional custom category creation.
- Dashboard with current month totals and category breakdown.
- Monthly budget (single amount per month) with usage progress.
- Filters by date range and category.
- CSV export of transactions.

### Out of Scope (MVP)
- Bank account auto-sync.
- Multi-currency and forex handling.
- Shared/family accounts.
- Bill reminders.
- AI insights and forecasting.
- Investments, loans, or tax filing workflows.

## 5. User Stories
1. As a user, I can sign up and log in so my financial data is private.
2. As a user, I can add an income or expense transaction in a few seconds.
3. As a user, I can edit or delete wrong entries.
4. As a user, I can see this month’s income, expenses, and net amount at a glance.
5. As a user, I can see spending by category to understand where money goes.
6. As a user, I can set a monthly budget and track how much is left.
7. As a user, I can filter transactions by date/category.
8. As a user, I can export my transaction data to CSV.

## 6. Functional Requirements
### 6.1 Authentication
- FR-1: System must support user sign-up with unique email and password.
- FR-2: System must support login/logout.
- FR-3: Users can only access their own records.

### 6.2 Transactions
- FR-4: Users can create transactions with required fields: type, amount, date, category.
- FR-5: Note field is optional.
- FR-6: Users can update existing transactions.
- FR-7: Users can delete transactions.
- FR-8: Transaction list is sorted by date descending by default.

### 6.3 Categories
- FR-9: System provides default categories (e.g., Salary, Food, Rent, Transport, Utilities, Entertainment, Health, Other).
- FR-10: User can assign one category per transaction.
- FR-11: (Optional MVP) Users can add custom categories.

### 6.4 Dashboard
- FR-12: Show current month totals: total income, total expense, net balance.
- FR-13: Show spending by category for current month in chart or grouped list.
- FR-14: Show most recent 5 transactions.

### 6.5 Budget
- FR-15: User can set one monthly budget amount.
- FR-16: System displays budget consumed (%) and remaining amount for current month.

### 6.6 Filters and Export
- FR-17: User can filter transactions by date range.
- FR-18: User can filter transactions by category.
- FR-19: User can export current user’s transactions to CSV.

## 7. Non-Functional Requirements
- NFR-1: Responsive UI for desktop and mobile.
- NFR-2: Typical page loads should complete within 2 seconds under normal conditions.
- NFR-3: Basic input validation (required fields, positive amount, valid date).
- NFR-4: Secure password handling (hashed passwords, never plain text).
- NFR-5: Data access isolation by authenticated user ID.

## 8. Success Metrics (MVP)
- User can add a transaction in under 15 seconds.
- 100% of authenticated operations are user-scoped (no cross-user data exposure).
- Dashboard values match transaction data for selected month.
- CSV export contains complete user transaction records for selected filters.

## 9. Assumptions and Constraints
- Single-user usage model per account.
- Manual entry only in MVP.
- One currency for all transactions in MVP.
- Timezone based on user locale/browser settings.

## 10. High-Level Data Model
- User: id, email, password_hash, created_at
- Category: id, user_id (nullable for defaults), name, created_at
- Transaction: id, user_id, type, amount, date, category_id, note, created_at, updated_at
- Budget: id, user_id, month (YYYY-MM), amount, created_at, updated_at

## 11. Acceptance Criteria (MVP)
1. New user can register, log in, and log out.
2. Authenticated user can create, edit, delete, and view only their transactions.
3. Dashboard correctly shows monthly income, expense, and net values.
4. Monthly category breakdown reflects same-month expense data.
5. User can set monthly budget and see consumed/remaining values.
6. Filters apply correctly by date range and category.
7. CSV export downloads and includes expected transaction fields.

## 12. Future Enhancements (Post-MVP)
- Recurring transactions.
- Budget per category.
- Multi-currency support.
- Shared household wallets.
- Bank sync integrations.
- Smart insights and alerts.
