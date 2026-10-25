# موقع كروت NFC، نسخة قابلة للتعديل

## الملفات
| الملف | بيعمل إيه |
|---|---|
| `index.html` | الصفحة اللي بتفتح لما حد يلمس الكارت |
| `edit.html` | صفحة التعديل بتاعة صاحب الكارت |
| `app.js` / `edit.js` | الكود، متلمسهوش |
| `config.js` | الإعدادات بتاعتك: اسم البراند وبيانات Firebase |
| `firestore.rules` | قواعد الأمان لقاعدة البيانات |

## الوضع التجريبي (من غير أي إعداد)
ارفع الملفات كلها على GitHub Pages زي ما هي.
- `/edit.html` بيعدّل، بس التعديلات بتتحفظ **على الجهاز ده بس**.
- الوضع ده للتجربة. اللي يلمس الكارت من موبايل تاني مش هيشوف التعديلات.

## التشغيل الحقيقي، عشان تبيع لعملاء (Firebase ببلاش)
1. ادخل https://console.firebase.google.com واعمل Project جديد.
2. **Build ← Authentication ← Get started**، وفعّل **Email/Password**.
3. **Build ← Firestore Database ← Create database** (Production mode).
4. افتح تاب **Rules**، والصق محتوى `firestore.rules`، ودوس **Publish**.
5. **Project settings ← General ← Your apps**، ودوس **</>** (Web app)، وانسخ الـ `firebaseConfig`.
6. افتح `config.js` وحط الـ config مكان `firebase: null`.
7. في **Authentication ← Settings ← Authorized domains**، ضيف الدومين بتاعك (مثلاً `yourname.github.io`).

## إضافة عميل جديد (لكل كارت بتبيعه)
1. **Authentication ← Add user**: اعمل إيميل وباسورد للعميل، وانسخ الـ **User UID**.
2. **Firestore ← profiles** (أول مرة اعمل collection بالاسم ده)، ثم **Add document**:
   - Document ID: اسم قصير للعميل بالإنجليزي، مثلاً `mona`
   - Field: `ownerUid` (string)، والقيمة هي الـ UID اللي نسخته
   - Field: `name` (string)، واكتب فيه اسم العميل
3. اكتب على الكارت اللينك ده: `https://yourname.github.io/?u=mona`
4. ابعت للعميل اللينك ده: `https://yourname.github.io/edit.html`، ومعاه الإيميل والباسورد.

العميل بعد كده يدخل ويغيّر صورته ولينكاته وكل حاجة، والكارت بيفتح على النسخة الجديدة على طول. ولو نسي الباسورد، يدوس "نسيت الباسورد" في صفحة الدخول.
