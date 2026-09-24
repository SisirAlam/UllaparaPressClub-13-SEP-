# Security Specification: Ullapara Press Club Firestore Database

## 1. Data Invariants & Authorization Architecture
1. **Public Read-Access**: Members roster (`/members`), published notices (`/notices`), events calendar (`/events`), and club metadata (`/club_info`) are publicly readable by any visitor to guarantee transparency and public information dissemination.
2. **Citizen Submissions**: Citizen complaints and news reports (`/complaints`) can be created by the general public without prior account authentication, provided they adhere strictly to the schema (bounded string lengths for name, phone, union, subject, and details).
3. **Public Subscriptions**: Newsletter subscribers (`/subscribers`) can register publicly with a valid email and name. Subsequent read/delete operations require authentication or administrator privileges to prevent public data scraping.
4. **Administrative Protection**: Modifications (create, update, delete) to core club records (`/members`, `/notices`, `/events`, `/club_info`) require authenticated administrators.
5. **No Blanket Reads**: Sensitive records (`/complaints`, `/subscribers`) cannot be scraped anonymously.
6. **Input Boundaries**: Every document ID must satisfy `isValidId(id)` (`^[a-zA-Z0-9_\-]+$` and size <= 128 chars). All string fields are constrained with max lengths matching `firebase-blueprint.json`.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (ID Poisoning Attack)**
   - Target: `/members/` with 500-char path variable containing null bytes or script tags: `../../../hack?admin=true`
   - Invariant Violated: Path hardening (`isValidId`).

2. **Payload 2 (Ghost Field Privilege Escalation)**
   - Target: `/members/m1` write payload containing `isAdmin: true` or `role: 'superadmin'`.
   - Invariant Violated: Strict schema keys.

3. **Payload 3 (Unauthenticated Notice Tampering)**
   - Target: `/notices/n1` `update` with `{ "title": "Defaced Notice" }` without auth token.
   - Invariant Violated: Write requires authentication.

4. **Payload 4 (Citizen Complaint Oversized Payload Attack)**
   - Target: `/complaints/c1` with `details` string containing 2MB of junk text to cause Denial of Wallet.
   - Invariant Violated: Field length limit (`details.size() <= 5000`).

5. **Payload 5 (Unauthenticated Complaint Scraping)**
   - Target: `/complaints` `list` without authorization.
   - Invariant Violated: Citizen reports contain phone numbers and private PII; public list denied.

6. **Payload 6 (Subscriber PII Harvesting)**
   - Target: `/subscribers` query to extract all email addresses and phone numbers.
   - Invariant Violated: `allow read: if isSignedIn();` prevents unauthenticated PII scraping.

7. **Payload 7 (Event Hijacking by Unauthenticated User)**
   - Target: `/events/evt-01` `delete` or `update` by anonymous user.
   - Invariant Violated: Event modifications strictly restricted.

8. **Payload 8 (Club Info Spoofing)**
   - Target: `/club_info/main` set with fraudulent bank account or executive names.
   - Invariant Violated: Club metadata updates require verified administrative credentials.

9. **Payload 9 (Malformed Type Injection in Complaint)**
   - Target: `/complaints/c2` where `name` is a Boolean `true` or array `[1,2,3]` instead of `string`.
   - Invariant Violated: Type enforcement (`data.name is string`).

10. **Payload 10 (Direct Modification of Admin List)**
    - Target: `/admins/attackerUid` write by arbitrary user to elevate their own privileges.
    - Invariant Violated: Self-assigned administrative role blocked.

11. **Payload 11 (Oversized Notice Document Creation)**
    - Target: `/notices/n2` with `title` string length > 300 characters.
    - Invariant Violated: `data.title.size() <= 300`.

12. **Payload 12 (Subscribers Document Deletion by Anonymous Attacker)**
    - Target: `/subscribers/sub1` `delete` call by unauthenticated attacker.
    - Invariant Violated: Delete operations require authenticated administration.

---

## 3. Test Runner Definition: firestore.rules.test.ts
This specification serves as the formal model against which `firestore.rules` is validated. All 12 attack vectors must return `PERMISSION_DENIED`.
