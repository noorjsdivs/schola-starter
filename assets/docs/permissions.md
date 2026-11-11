# Schola — Permissions Catalogue

> Source of truth for permission keys. The original spec governs the model.

## Conventions

- Keys are `resource:action` or `resource:action:scope`.
- Roles are bundles of permissions — never check role strings in business logic. Always check the permission.
- Scope suffixes:
  - `:own` — only records owned by the actor.
  - `:own_classes` — limited to classes/sections the actor is assigned to.
  - `:all` — everything within the tenant (`super_admin` can extend `:all` to all tenants via `withSuperAdmin`).
  - `:tenant` — limited to the actor's tenant (everything within the school).

## Roles

| Role             | Scope    | Notes                                                   |
| ---------------- | -------- | ------------------------------------------------------- |
| `super_admin`    | Platform | Approves/suspends schools, audits all.                  |
| `school_admin`   | Tenant   | Owns one school. Can transfer ownership.                |
| `principal`      | Tenant   | Academic head. No billing, no admin transfer.           |
| `vice_principal` | Tenant   | Configurable subset of principal.                       |
| `teacher`        | Tenant   | Manages assigned classes / sections only.               |
| `accountant`     | Tenant   | Fees + payroll + financial reports. No academics edits. |
| `student`        | Tenant   | Reads own profile, attendance, grades, fees.            |
| `parent`         | Tenant   | Reads linked children's data only.                      |
| `staff`          | Tenant   | Non-teaching staff. Sees own attendance + salary.       |


### Platform (super_admin only)

- `school:approve`
- `school:reject`
- `school:suspend`
- `school:read_all`
- `audit_log:read:all`
- `user:impersonate` (Phase 5+, dual-signed off)
- `admin_transfer:force`

### Tenant — schools & academics

- `school:read:tenant`
- `school:update:tenant`
- `academic_year:create` / `:update` / `:delete` / `:read`
- `class:create` / `:update` / `:delete` / `:read`
- `class:assign_teacher`
- `section:create` / `:update` / `:delete` / `:read`
- `subject:create` / `:update` / `:delete` / `:read`

Read access to the school structure — pages that pick a year, class or section need these even when the role edits nothing there:

| Key                  | Granted to                                | Needed by                                                                 |
| -------------------- | ----------------------------------------- | ------------------------------------------------------------------------- |
| `academic_year:read` | admin, principal, VP, teacher, accountant | Classes, Exams, Fees (year pickers), Admissions                           |
| `class:read`         | admin, principal, VP, teacher, accountant | Classes, Students filter, Fees invoice generation                         |
| `section:read`       | admin, principal, VP, teacher, accountant | Sections, Attendance, Timetable, Students filter, Fees invoice generation |
| `subject:read`       | admin, principal, VP, teacher, accountant | Subjects, Gradebook, Teachers list (subject names)                        |

### Tenant — people

- `student:create` / `:read` / `:update` / `:delete`
- `teacher:create` / `:read` / `:update` / `:delete`
- `parent:create` / `:read` / `:update` / `:delete`
- `staff:create` / `:read` / `:update` / `:delete`

### Tenant — attendance & academics

- `attendance:mark`
- `attendance:read:own_classes`
- `attendance:read:all`
- `staff_attendance:mark`
- `staff_attendance:read:own`
- `staff_attendance:read:all`
- `grade:enter`
- `grade:read:own_classes`
- `grade:read:all`
- `remark:create`
- `remark:read:own_classes`
- `remark:read:all` — every remark in the school (school admin, principal, vice principal)
- `exam:create` / `:update` / `:read`
- `exam:delete` — remove an exam and its marks (school admin, principal)

### Tenant — finance

- `fee_structure:create` / `:update` / `:read`
- `fee:collect`
- `fee:read:own`
- `fee:read:tenant`
- `fee:waive`
- `salary_structure:create` / `:update` / `:read`
- `salary:read:own`
- `salary:read:all`
- `salary:pay`

### Tenant — meta

- `audit_log:read:tenant`
- `report:export` — CSV exports. Each export also needs the read key for its data: fees → `fee:read:tenant`, attendance → `attendance:read:all`, payroll → `salary:read:all`.
- `notification:read:own`
- `notification:send:tenant` — send announcements to the school's members
- `user:assign_role:tenant` — grant / revoke principal, vice principal and accountant inside one school (school admin). Never `school_admin`: that moves only by admin transfer.

### Tenant — operations modules

| Key                | Granted to                                                | Allows                                                                                        |
| ------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `timetable:read`   | admin, principal, VP, teacher, student, parent            | View timetables (staff: any section; teacher: own week; student / parent: the student's week) |
| `timetable:manage` | admin, principal                                          | Edit periods                                                                                  |
| `leave:request`    | every tenant role                                         | Ask for leave (self, or a linked child for parents); cancel while pending                     |
| `leave:approve`    | admin, principal, VP                                      | Approve / reject — never one's own request                                                    |
| `leave:read:all`   | admin, principal, VP                                      | See every request in the school                                                               |
| `admission:read`   | admin, principal, VP                                      | View applications                                                                             |
| `admission:manage` | admin, principal                                          | Create, edit, move through the pipeline, enroll (with `student:create`)                       |
| `library:read`     | admin, principal, VP, teacher, accountant, student, staff | Browse the catalogue; see own loans                                                           |
| `library:manage`   | admin, principal                                          | Books, issue, return                                                                          |
| `transport:read`   | admin, principal, VP, accountant                          | Routes and riders                                                                             |
| `transport:manage` | admin                                                     | Edit routes and riders                                                                        |
| `hostel:read`      | admin, principal, VP, accountant                          | Rooms and occupants                                                                           |
| `hostel:manage`    | admin                                                     | Allocate, move, vacate                                                                        |

Students and parents see the student's bus route, hostel room and open library loans on the student record (`/student-records/:id/services`), through the link check — no extra permission.

### Own-scope reads

The `:own` and `:own_classes` keys are resolved through the people records:

- **Teacher** — sections they lead (`Section.teacherId`) or whose class they are homeroom for (`Class.classTeacherId`), and the students actively enrolled there.
- **Student** — their own `Student` record (`Student.userId`).
- **Parent** — students whose `parentIds` include their `Parent` record (`Parent.userId`).
- **Teacher / staff as employees** — their own `StaffAttendance` and `SalaryRecord` rows (`staff_attendance:read:own`, `salary:read:own`). `staff_attendance:read:own` is also held by the school admin, principal, vice principal and accountant, so anyone linked to a teacher or staff record sees their own attendance on `/app/my/attendance`. It never shows anyone else's rows.

Remarks carry a `visibility`: parents read `parent` and `public` remarks about their children, students read `public` remarks about themselves, staff with `remark:read:*` read all three. Report cards never print `private` remarks.

## Defaults

Default role → permissions mapping lives in `apps/api/src/services/rbac/permissions.ts`. It is re-applied to every approved school on API start (additive only), so a key added there reaches existing schools without a migration.
