# Demo data

One command fills a database with a complete, realistic Schola platform for demos, walkthroughs, and manual testing.

```sh
pnpm seed
```

It reads `MONGODB_URI` and `ENCRYPTION_MASTER_KEY` from `test.env` (then `.env`), like the API. Nothing else is required. When `DATABASE_URL` is set, the demo accounts are also mirrored to the Neon identity database, the same way signup does it.

## Sign-in accounts

Every account uses the same password: **`Schola@2026`** (change it with `--password`).

| Role                | Email                              | What it shows                                                                                  |
| ------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| Super admin         | `superadmin@schola.example`        | Platform dashboard, all schools, approvals, suspension, audit log                              |
| School admin        | `admin@greenfield.example`         | Owner of Greenfield International School — everything in the school                            |
| Principal           | `principal@greenfield.example`     | Academic head                                                                                  |
| Vice principal      | `viceprincipal@greenfield.example` | Read-mostly academic access                                                                    |
| Accountant          | `accountant@greenfield.example`    | Fees, payments, payroll                                                                        |
| Teacher             | `teacher@greenfield.example`       | Grace Mensah — My classes (Grade 3's sections), registers to take, own attendance and payslips |
| Staff               | `staff@greenfield.example`         | Ruby Novak, Librarian — own attendance and payslips                                            |
| Parent              | `parent@greenfield.example`        | A parent with two children — My children, each child's attendance, grades, remarks and fees    |
| Student             | `student@greenfield.example`       | A Grade 8 student — My attendance, grades (report card PDF) and fees                           |
| Applicant (pending) | `owner@riverside.example`          | Signs in only after the super admin approves Riverside Academy                                 |

All 30 teachers can also sign in as `firstname.lastname@greenfield.example` (for example `farida.begum@greenfield.example`), with the same password.

## What gets created

**Platform** — four schools so every super-admin screen has content:

- **Greenfield International School** — active, fully set up (below).
- **Riverside Academy** and **Lakeside Coaching Centre** — applications waiting for approval (with sign-up notifications for the super admin).
- **Hilltop College** — suspended (overdue subscription).

**Greenfield International School**

| Area           | Contents                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Academic years | Previous year and the current year (marked current)                                                                                              |
| Subjects       | 12 — English, Mathematics, Science, Social Studies, French, Computer Science, Art & Design, Music, PE, Physics, Chemistry, Biology               |
| Classes        | Grade 1 – Grade 10, each with sections A and B (20 sections, 30 seats each), a class teacher, and the subjects taught at that level              |
| Teachers       | 30 — 20 section teachers plus specialists, each with qualifications, subjects, and a sign-in                                                     |
| Students       | 500, enrolled 25 per section with roll numbers; phone, date of birth and address stored encrypted                                                |
| Parents        | About 600, linked to their children (siblings share parents)                                                                                     |
| Staff          | 10 non-teaching staff (office, finance, library, lab, health, counselling, IT, transport, security)                                              |
| Attendance     | The last 20 school days for every student, teacher, and staff member. Today is in progress: 16 sections done, one half done, three still to take |
| Exams & grades | Term 1 midterm (marked for every student in the core subjects, with letter grades) and the upcoming Term 1 final                                 |
| Remarks        | 90 teacher remarks (academic, behaviour, attendance, general)                                                                                    |
| Fees           | Monthly fee structures for primary, middle, and senior school; invoices for every student for the current term's months; payments and receipts   |
| Payroll        | Three salary structures; payslips for every teacher and staff member — previous months paid, the current month pending                           |
| Timetable      | Every section, Monday–Friday, 6 periods with subject, teacher (no clashes) and room                                                              |
| Leave          | Pending requests from the demo parent and teacher to decide, plus approved and declined history                                                  |
| Admissions     | 14 applications across submitted, reviewing, interview, offered, rejected and withdrawn                                                          |
| Library        | 30 books (1–4 copies each) and about 30 loans, some overdue, including the demo student and teacher                                              |
| Transport      | 4 bus routes with stops and drivers; about 120 primary students ride, including the demo parent's children                                       |
| Hostel         | Two houses (boys / girls), 20 rooms of 4 beds; about 50 senior boarders, including the demo student                                              |
| Notifications  | Welcome, exam, and fee-collection notices for the admin                                                                                          |

Dates are relative to the day you run the seed, so attendance, fees, and payroll always look current. Names and marks come from a fixed random seed, so two runs on the same day produce the same school.

## Options

```sh
pnpm seed -- --reset                     # remove the demo data, then seed a fresh copy
pnpm seed -- --password 'Another-Pass1'  # a different password for every demo account
pnpm seed -- --students 300              # 20–600 students (20 sections × 30 seats)
pnpm seed -- --help
```

- Running `pnpm seed` twice stops with a message instead of creating duplicates. Use `--reset` to start over.
- `--reset` removes only the demo schools (everything stored under them) and accounts on the reserved demo domains (`*.example`). Other schools and users are not touched. Audit log entries are append-only and stay.
- With `NODE_ENV=production` the seed refuses to run unless you pass `--allow-production` **and** your own strong `--password`. Don't put known demo passwords on a public deployment.

## Troubleshooting

- **`ENCRYPTION_MASTER_KEY is not set`** — generate one with `openssl rand -base64 32` and add it to `test.env`. See [services/encryption.md](./services/encryption.md). Use the same key the API runs with, or the encrypted fields will not decrypt.
- **`querySrv ENOTFOUND …mongodb.net`** or a timeout — check `MONGODB_URI` and that your IP is allowed in Atlas → Network Access. See [services/mongodb-atlas.md](./services/mongodb-atlas.md).
- **`Demo data is already in this database`** — run `pnpm seed -- --reset`.

The dataset is built in [`apps/api/src/seed/demo-school.ts`](../apps/api/src/seed/demo-school.ts) and written by [`apps/api/src/seed/run-demo-seed.ts`](../apps/api/src/seed/run-demo-seed.ts). The in-browser "Load sample" mode in the dashboard is separate: it never touches the database.
