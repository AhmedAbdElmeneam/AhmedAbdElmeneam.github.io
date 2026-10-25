# موقع كروت NFC، نسخة قابلة للتعديل

## كل كارت ليه لينكين
| اللينك | مين بياخده | بيعمل إيه |
|---|---|---|
| `…/?u=mona` | بيتكتب على الكارت | الصفحة اللي بتفتح لأي حد يلمس الكارت. مفيهاش أي طريقة للتعديل |
| `…/edit.html?k=K4ZS-BHFK-PDY7` | صاحب الكارت بس | صفحة التعديل. الكود اللي في آخره سري، وكل عميل ليه كود مختلف |

## الملفات
| الملف | بيعمل إيه |
|---|---|
| `index.html` | الصفحة اللي بتفتح من الكارت |
| `edit.html` | صفحة التعديل، وبتفتح بالكود بس |
| `app.js` / `edit.js` | الكود، متلمسهوش |
| `config.js` | الإعدادات: اسم البراند، وكود التجربة، وبيانات Firebase |
| `firestore.rules` | قواعد الأمان |
| `codes.txt` | 30 كود جاهزين للعملاء. **متطلعهوش على GitHub** |

## الوضع التجريبي (دلوقتي)
- لينك التعديل بتاعك: `edit.html?k=` وبعده الكود المكتوب في `demoKey` في ملف `config.js`.
- التعديلات بتتحفظ على الجهاز ده بس، فالوضع ده للتجربة مش للبيع.
- الكود في الوضع ده موجود جوه `config.js`، فأي حد شاطر يقدر يعرفه. التعديل بيأثر على جهازه هو بس، فمفيش خطر، بس الحماية الحقيقية بتبدأ مع Firebase.

## التشغيل الحقيقي (Firebase ببلاش)
1. ادخل https://console.firebase.google.com واعمل Project جديد.
2. **Authentication ← Get started ← Sign-in method**، وفعّل **Anonymous**. مش محتاج إيميلات ولا باسوردات.
3. **Firestore Database ← Create database** (Production mode).
4. افتح تاب **Rules**، والصق محتوى `firestore.rules`، ودوس **Publish**.
5. **Project settings ← Your apps**، ودوس **</>**، وانسخ الـ `firebaseConfig` وحطه في `config.js` مكان `firebase: null`.
6. **Authentication ← Settings ← Authorized domains**، وضيف `ahmedabdelmeneam.github.io`.

## لما تبيع كارت جديد
1. خد كود من `codes.txt` (مثلاً `K4ZS-BHFK-PDY7`) واشطب عليه.
2. في **Firestore**، افتح collection اسمها `keys` (أول مرة اعملها بالاسم ده)، ثم **Add document**:
   - **Document ID:** الكود نفسه `K4ZS-BHFK-PDY7`
   - **Field:** `slug` (string)، والقيمة اسم قصير للعميل بالإنجليزي، مثلاً `mona`
3. اكتب على الكارت: `https://ahmedabdelmeneam.github.io/?u=mona`
4. ابعت للعميل لينك التعديل: `https://ahmedabdelmeneam.github.io/edit.html?k=K4ZS-BHFK-PDY7`

العميل يفتح لينك التعديل من أي موبايل أو لاب، ويغيّر اللي هو عاوزه، ويدوس حفظ، والكارت بيفتح على النسخة الجديدة على طول.

## لو لينك التعديل اتسرّب
امسح الـ document بتاع الكود ده من `keys`، واللينك هيبطّل يشتغل في ساعتها. بعدها اعمل document جديد بكود تاني لنفس الـ `slug`، وابعت للعميل اللينك الجديد. البيانات بتاعته مش هتتمسح.
