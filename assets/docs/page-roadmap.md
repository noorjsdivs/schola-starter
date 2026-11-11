# Page roadmap — what exists, what to add

Audit of every route in `apps/web` against the original spec and the permissions each role actually holds (as of 2026-11-01, `main` at `2654691`). Status was checked in the code — routes, API permissions, and whether each role can really use a page — not just by page name.

> **Status update 2 (2026-11-01):** timetable, leave requests, admissions, library, transport and hostel are built, and the Playwright E2E suite and GitHub Actions CI from §6 exist. Homework tracking and messaging remain out of scope for v1.
>
> **Status update 1 (2026-11-01):** everything in §2, §3 and §4 is built, plus two §5 items that the original spec now covers — the **school members & roles page** (`user:assign_role:tenant`) and **exam delete** (`exam:delete`), both added to the original spec. The rest of §5 still needs a spec decision, and §6 (Playwright E2E, Mongo-backed integration runs) is still open.

**Effort:** S ≈ up to a day · M ≈ 2–3 days · L ≈ a week. "API" says whether the backend already supports the page.

---

## 1. What is done

| Area                    | Pages                                                                                                                    | State                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Marketing (public, SEO) | `/`, about, academics (+detail), admissions, contact, events (+detail), FAQ, features, news (+detail), pricing, legal ×2 | Complete                                                                      |
| Auth                    | login, signup, forgot / reset password, verify, onboarding/school, welcome                                               | Complete                                                                      |
| Super admin             | dashboard, schools (+detail, +new), approvals, users (role management), audit log, notifications, settings ×5            | Complete except force admin transfer (§3)                                     |
| School setup            | academic years, subjects, classes, class detail (sections + roster)                                                      | Complete — add / edit / delete, enrollment, capacity                          |
| People                  | students, teachers, parents, staff                                                                                       | Complete — add / edit / delete, search, class placement, parent ↔ child links |
| Attendance              | student attendance (daily overview + register), staff attendance                                                         | Complete for admins and teachers                                              |
| Academics               | exams, gradebook, remarks                                                                                                | Usable; missing edit / delete and teacher scoping (§4)                        |
| Finance                 | fees (structures, invoices, payments, receipts, Stripe checkout), payroll (structures, runs, payslips)                   | Usable for admin / accountant; missing edit of structures (§4)                |
| Admin                   | dashboard (setup checklist), notifications, audit log, settings (account + admin transfer)                               | Dashboard needs a role split (§2); settings needs school profile (§4)         |
| Demo                    | "Load sample" in-browser school, `pnpm seed` database seed                                                               | Complete                                                                      |

---

## 2. Fix first — broken or unsafe today ✅ done

| #   | Problem                                                                                                                                                                                             | What to add                                                                                                                          | API                                                  | Effort   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | -------- |
| 2.1 | **Every signed-in member sees school-wide finance.** `GET /dashboard/summary` has no permission check, so students and parents get outstanding fees, this month's collections, and pending payroll. | Gate finance and school-wide counts by permission (`fee:read:tenant`, `salary:read:all`); give other roles their own dashboard (§3). | Change existing endpoint                             | S        |
| 2.2 | **Admin-transfer email link is a 404.** The email sends the new owner to `/admin-transfer?token=…`; no such page exists, so a transfer can't be accepted.                                           | Page `/admin-transfer` — shows the school, asks the signed-in target to accept, calls `POST /admin-transfer/accept`.                 | Exists                                               | S        |
| 2.3 | **Students, parents, and staff land in an empty app.** Their sidebar shows Attendance / Gradebook, which return no sections or a 403, and nothing about their own records.                          | Role portals in §3.                                                                                                                  | Needs own-scope endpoints                            | (see §3) |
| 2.4 | **Teachers can pick any class in the gradebook**, then get a 403 for sections they don't teach.                                                                                                     | Limit the gradebook (and remarks) pickers to the teacher's own sections.                                                             | Add "my sections" read (or reuse attendance summary) | S        |

---

## 3. Missing pages by role ✅ done

The original spec gives each role its own scope (§7.1): students read their own profile, attendance, grades, and fees; parents read their linked children; staff see their own attendance and salary; teachers manage their assigned sections. The permissions exist (`fee:read:own`, `salary:read:own`, `staff_attendance:read:own`, `attendance:read:own_classes`, …) but **no endpoint or page uses the `:own` ones yet**.

### Student

| Route                 | Shows                                                          | API                                                              | Effort |
| --------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- | ------ |
| `/app` (student view) | Today's status, attendance %, latest marks, fees due           | New `GET /me/summary`                                            | M      |
| `/app/my/attendance`  | Calendar / list of own attendance with monthly %               | New own-scope read (history endpoint filtered to self)           | S      |
| `/app/my/grades`      | Marks by exam and subject, letter grades, report card download | New own-scope grades read                                        | M      |
| `/app/my/fees`        | Own invoices, receipts, **Pay online** (Stripe)                | New `fee:read:own` reads; checkout currently needs `fee:collect` | M      |
| `/app/profile`        | Own details, change password (see "Everyone")                  | Partly (`/auth/me`)                                              | S      |

### Parent

| Route                | Shows                                                                      | API                                          | Effort |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------------------- | ------ |
| `/app` (parent view) | One card per child: attendance today, fees due, latest remark              | New `GET /me/children`                       | M      |
| `/app/children/[id]` | A child's attendance, grades, remarks (visibility `parent`/`public`), fees | New child-scoped reads (must check the link) | L      |
| Pay fees             | Stripe checkout for a child's invoice                                      | Allow checkout for linked parents            | S      |

### Teacher

| Route                                    | Shows                                                      | API                                                      | Effort |
| ---------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- | ------ |
| `/app` (teacher view)                    | My sections, registers still to take today, marks to enter | Mostly exists (attendance summary is already scoped)     | S      |
| `/app/my/classes`                        | Sections I lead / homeroom, with rosters and quick links   | Exists (sections list + scope helper)                    | S      |
| `/app/my/attendance`, `/app/my/payslips` | Own staff attendance and payslips                          | New `staff_attendance:read:own`, `salary:read:own` reads | M      |

### Non-teaching staff

| Route                | Shows                          | API                                  | Effort |
| -------------------- | ------------------------------ | ------------------------------------ | ------ |
| `/app` (staff view)  | Today's status, last payslip   | New `GET /me/summary`                | S      |
| `/app/my/attendance` | Own attendance                 | New `staff_attendance:read:own` read | S      |
| `/app/my/payslips`   | Own payslips with PDF download | New `salary:read:own` read           | S      |

### Everyone

| Route          | Shows                                                                           | API                                          | Effort |
| -------------- | ------------------------------------------------------------------------------- | -------------------------------------------- | ------ |
| `/app/profile` | Name, phone, photo (ImageKit), change password, sign out of other devices (§11) | Partly — needs profile update + session list | M      |

---

## 4. Missing pages for admins ✅ done

| Route / change                                               | Why                                                                                                                                                               | API                                                             | Effort |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------ |
| `/app/students/[id]` — student profile                       | One place for a student: details, class history, attendance, grades, remarks, fees, parents. Lists link here.                                                     | Exists (`/students/:id`, attendance history, remarks, invoices) | M      |
| `/app/teachers/[id]`, `/app/staff/[id]`, `/app/parents/[id]` | Detail views: assignments, attendance, payslips, children                                                                                                         | Mostly exists                                                   | M      |
| `/app/reports`                                               | the original spec "reports & dashboards": attendance by class / month, chronic absentees, fee defaulters, class results; one home for the CSV exports now scattered on pages | Partly (3 CSV exports); new aggregate reads                     | L      |
| Report cards (PDF)                                           | spec lists PDFs for "receipts, reports"; only receipts and payslips exist                                                                                       | New `@react-pdf` document + endpoint                            | M      |
| `/app/settings` → school profile                             | `school:update:tenant` exists but no endpoint or form edits the school's name, address, phone, locale, currency                                                   | New `PATCH /schools/mine`                                       | S      |
| Exams — edit / delete                                        | Exams page only creates                                                                                                                                           | Edit exists; delete needs `exam:delete` (not in the original spec)            | S      |
| Fee & salary structures — edit                               | Pages only create                                                                                                                                                 | Exists (`PATCH`)                                                | S      |
| Remarks — delete                                             | UI can't delete a remark                                                                                                                                          | Exists                                                          | S      |
| `/app/announcements`                                         | `notification:send:tenant` exists, but there is no way to send a notice to staff / parents                                                                        | New send endpoint (in-app + email)                              | M      |
| Error + loading boundaries                                   | No `error.tsx` / `loading.tsx` under `/app` or `/platform`; the original spec asks for clear error states with retry                                                      | —                                                               | S      |

### Super admin

| Change               | Why                                                                                                                                  | API          | Effort |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------ |
| Force admin transfer | the original spec: super admin can move ownership when the admin is unavailable (`admin_transfer:force`). Neither endpoint nor button exists. | New endpoint | S      |

---

## 5. Needs a spec decision first

These are common in school systems but **not in the original spec v1** (the project rule: never invent features, permissions or endpoints without asking). Each needs the original spec updated before building.

| Feature                                  | Why it comes up                                                                                                                                                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~School members & roles page~~ ✅ built | Today a school admin can't make someone a principal, vice principal, or accountant — only the super admin can (Platform → Users). Needs a tenant permission such as `user:assign_role:tenant`. **Highest-value item in this section.** |
| ~~Exam delete~~ ✅ built                 | `exam:delete` added to the original spec.                                                                                                                                                                                                       |
| Timetable / class schedule               | Weekly periods per section and teacher.                                                                                                                                                                                                |
| Homework / assignments                   | Explicit LMS-style content is a v1 non-goal; light homework tracking would need scoping.                                                                                                                                    |
| Admissions pipeline                      | Applications → interview → offer → enroll, before a student record exists.                                                                                                                                                             |
| Leave requests                           | Staff and student leave with approval, feeding attendance as "excused".                                                                                                                                                                |
| Library, transport, hostel               | Separate modules in ERPs like Fedena / OpenEduCat (spec references).                                                                                                                                                                 |
| Messaging                                | Two-way teacher ↔ parent messages beyond one-way announcements.                                                                                                                                                                        |

---

## 6. Not pages, but missing

- ✅ **E2E tests** — `apps/web/e2e/` + CI (`.github/workflows/ci.yml`). The original spec requires Playwright flows (signup → approval → class → enrollment → attendance → payment). There is no `apps/web/e2e/` or Playwright config yet. `pnpm seed` gives these tests a ready school to run against.
- ✅ **API integration tests** run in CI. They need a MongoDB binary (`mongodb-memory-server`); run `pnpm test` locally or in CI.

---

## Suggested order

1. §2 fixes — dashboard permission (2.1), admin-transfer page (2.2), teacher-scoped pickers (2.4). _Small, and they close real bugs._
2. Own-scope API + role dashboards (§3) — student, parent, staff, teacher. _Makes every role's login meaningful._
3. Student profile page, school profile settings, structure / exam / remark editing (§4).
4. Reports page + report-card PDF, announcements.
5. Decide §5 with the original spec owner — start with the school members & roles page.
6. Playwright E2E suite on top of `pnpm seed`.
