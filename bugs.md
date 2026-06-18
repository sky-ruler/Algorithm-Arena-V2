# Known Issues & Backlog

Status tracker. Most items are now fixed (see "Fixed"). Only two remain — both
blocked on your input, not on code.

---

## STILL NEEDS YOUR INPUT

### 3. "When accepting a member to a clan it says …" (message was cut off)
**Status:** Needs the exact message / repro.

The backend approve/add flows are correct, and the stale-list refresh that could
explain it is now fixed (React Query v5 invalidation). If you still see a
message, tell me the exact text and whether the member actually gets added. One
likely source: the welcome **email send** step (`utils/emailService`) erroring
when SMTP isn't configured — in local dev that's mocked, so it won't show.

### 6. "Don't need overhead for code" (unclear)
**Status:** Needs clarification. Candidate meanings:
- (a) Remove the optional **GitHub repo URL** field from the submission panel.
- (b) Trim extra/boilerplate fields in the submission flow.
- (c) A perceived performance/heaviness issue.

---

## FIXED

### Minor (earlier pass)
- **#4 / #11 / #13 — stale data, clan stats & member counts.** Converted all 73
  TanStack Query **v5** `invalidateQueries(['key'])` (removed v4 form) →
  `invalidateQueries({ queryKey: [...] })`.
- **#8 — empty difficulty filters hidden** (`Missions.jsx` derives available
  difficulties).
- **#9 — resource filtering** now uses the server's `folder` field + full
  8-folder list (`client` + `admin-client` browse pages).
- **#2 — code editor area** test/result panel is now drag-resizable + collapsible
  (`ChallengeDetails.jsx`).

### Major (this pass)
- **#1 — username/regNo dup-key (E11000).** Model now uses **partial unique
  indexes** (`{ $type: 'string' }`) instead of `sparse`, so nulls never collide.
  Added `repairUserIndexes()` in `server.js` (prod-only) that drops the legacy
  `username_1`/`regNo_1` indexes, clears null values, and rebuilds partial ones
  on startup. ⚠️ It runs automatically on the next **production** boot — verify
  the logs show the drop/rebuild once.
- **#5 — edit/delete a Question Set.** Added `updateQuestionSet` /
  `deleteQuestionSet` (controller + `PUT`/`DELETE /api/sets/:id`). Update
  reconciles the mirrored `Challenge` docs by title (preserves _ids / submission
  refs). Admin `QuestionSetsTab` now has Edit (reuses the create form) and Delete.
- **#7 — run code + test cases.** Already implemented via Judge0 in
  `ChallengeDetails.jsx`; confirmed working. (Prod note: it falls back to the
  public, rate-limited `ce.judge0.com` — set `VITE_JUDGE0_API_URL` to a
  self-hosted/RapidAPI Judge0 for production reliability.)
- **#10 — PDFs accessible by everyone.** Replaced the broken
  `URL.createObjectURL` blob with a real upload: `POST /api/resources/upload`
  (multer, 8MB cap) stores the file in Mongo and serves it via the public
  `GET /api/resources/:id/file`. Admin `ResourcesTab` uploads the actual file;
  browse pages resolve the URL against the API host.
  *Future optimization:* move storage to Firebase Storage / S3 to keep large
  blobs out of MongoDB (the 8MB cap keeps docs under the 16MB BSON limit).
- **#12 — per-user code language preference.** Added `preferredLanguage` to the
  User model + `update-me` validator/handler; Settings has a selector; the editor
  in `ChallengeDetails.jsx` defaults to the user's preferred language.

### Cleanup note
`admin-client/src/pages/admin/ResourcesAdmin.jsx` is dead/unused (AdminPanel
routes `ResourcesTab`) and still sends `category` instead of `folder` — delete it
when convenient.
