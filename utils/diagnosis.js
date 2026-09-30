
const SYMPTOMS = [
    {
        id: 'shaking', label: 'Shaking or misfiring', ar: 'رجفة', urgency: 'soon',
        words: ['ترجف', 'رجفه', 'يرجف', 'تهتز', 'اهتزاز', 'رعشه', 'تتنفض', 'shake', 'shaking', 'vibrat', 'misfire', 'rough idle', 'rough'],
        codes: { P0300: 5, P0301: 3, P0302: 3, P0303: 3, P0304: 3, P0171: 2, P0101: 1 },
        ask: { ar: 'الرجفة تصير والسيارة واقفة (سلانسيه)، ولا وقت المشي والدوس على البنزين؟', en: 'Does it shake while standing still (idle) or while driving and accelerating?' }
    },
    {
        id: 'stalling', label: 'Engine stalls or turns off', ar: 'انطفاء', urgency: 'stop',
        words: ['تطفي', 'طفت', 'تنطفي', 'ينطفي', 'انطفت', 'تموت', 'stall', 'dies', 'shuts off', 'turns off', 'cuts out'],
        codes: { P0505: 4, P0335: 4, P0101: 3, P0171: 2, P0122: 2, P0230: 2 },
        ask: { ar: 'تطفي وهي واقفة عند الإشارة، ولا حتى وهي ماشية؟', en: 'Does it turn off when you stop at a light, or even while driving?' }
    },
    {
        id: 'no-start', label: 'Hard to start or will not start', ar: 'صعوبة تشغيل', urgency: 'soon',
        words: ['ما تشتغل', 'ماتشتغل', 'صعب تشتغل', 'ما تدور', 'ماتدور', 'تتاخر تشتغل', 'won\'t start', 'wont start', 'hard start', 'no start', 'not start', 'cranks'],
        codes: { P0335: 5, P0340: 4, P0230: 3, P0562: 3, P0087: 2 },
        ask: { ar: 'وقت التشغيل، المكينة تدور (صوت السلف) بس ما تشتغل، ولا ما في أي صوت؟', en: 'When you turn the key, does the engine crank but not start, or does nothing happen at all?' }
    },
    {
        id: 'fuel', label: 'High fuel consumption', ar: 'استهلاك بنزين عالي', urgency: 'drive',
        words: ['تاكل بنزين', 'تصرف', 'استهلاك', 'بنزين وايد', 'تشرب بنزين', 'fuel economy', 'mileage', 'fuel consumption', 'uses a lot of fuel', 'gas'],
        codes: { P0172: 4, P0171: 3, P0133: 3, P0420: 2, P0101: 2, P0128: 2 },
        ask: { ar: 'مؤشر الحرارة يوصل النص عادي، ولا يظل تحت؟', en: 'Does the temperature gauge reach the middle, or does it stay low?' }
    },
    {
        id: 'power', label: 'Weak acceleration or no power', ar: 'ضعف في السحب', urgency: 'soon',
        words: ['ضعيفه', 'ما تسحب', 'ماتسحب', 'ثقيله', 'بطيئه', 'ما فيها حيل', 'ما تمشي', 'no power', 'sluggish', 'weak', 'hesitat', 'slow', 'limp'],
        codes: { P0101: 4, P0121: 3, P0299: 3, P0420: 3, P0171: 2, P0300: 2 },
        ask: { ar: 'السيارة تيربو؟ وفي ريحة أو دخان من الشكمان؟', en: 'Is the car turbocharged? Any smell or smoke from the exhaust?' }
    },
    {
        id: 'smell', label: 'Smoke or bad smell', ar: 'دخان أو ريحة', urgency: 'soon',
        words: ['ريحه', 'دخان', 'تدخن', 'ريحة بيض', 'smell', 'smoke', 'rotten egg', 'fumes'],
        codes: { P0420: 5, P0172: 3, P0455: 3, P0442: 2 },
        ask: { ar: 'الدخان لونه أسود، ولا أبيض، ولا أزرق؟', en: 'Is the smoke black, white, or blue?' }
    },
    {
        id: 'overheat', label: 'Overheating', ar: 'ارتفاع الحرارة', urgency: 'stop',
        words: ['حراره', 'تسخن', 'ساخنه', 'حاره', 'تغلي', 'الماي', 'الرديتر', 'overheat', 'hot', 'temperature', 'coolant', 'radiator'],
        codes: { P0217: 5, P0128: 4, P0117: 3, P0118: 3, P0480: 3 },
        ask: { ar: 'مروحة الرديتر تشتغل لما تسخن؟ ومستوى الماي ناقص؟', en: 'Does the radiator fan turn on when it gets hot? Is the coolant level low?' }
    },
    {
        id: 'gearbox', label: 'Gearbox or shifting problem', ar: 'مشكلة في القير', urgency: 'soon',
        words: ['القير', 'قير', 'الجير', 'جير', 'نتعه', 'تنتع', 'ترفس', 'تبديل', 'gear', 'transmission', 'shift', 'slip', 'jerk'],
        codes: { P0700: 5, P0730: 4, P0715: 3, P0740: 3, P0750: 2 },
        ask: { ar: 'النتعة تصير وقت التبديل من غيار لغيار، ولا القير يعلق على غيار واحد؟', en: 'Does it jerk when changing gears, or does it get stuck in one gear?' }
    },
    {
        id: 'light', label: 'Check engine light is on', ar: 'لمبة المكينة', urgency: 'drive',
        words: ['لمبه', 'ضوء المكينه', 'لمبة المكينه', 'check engine', 'engine light', 'warning light', 'mil'],
        codes: { P0420: 2, P0455: 2, P0442: 2, P0171: 2, P0300: 2 },
        ask: { ar: 'اللمبة ثابتة ولا تومض؟ (إذا تومض، الأفضل إيقاف السيارة)', en: 'Is the light steady or flashing? (If it flashes, do not drive.)' }
    },
    {
        id: 'electric', label: 'Battery or electrical problem', ar: 'مشكلة كهرباء', urgency: 'soon',
        words: ['بطاريه', 'كهربا', 'الدينمو', 'دينمو', 'تفصل', 'battery', 'electrical', 'alternator', 'charging', 'dim'],
        codes: { P0562: 5, P0563: 3, P0620: 3, P0622: 2 },
        ask: { ar: 'الأنوار تضعف وقت تشغيل المكيف أو والسيارة واقفة؟', en: 'Do the lights dim when the AC is on or at idle?' }
    },
    {
        id: 'noise', label: 'Knocking or engine noise', ar: 'صوت أو طقطقة', urgency: 'soon',
        words: ['طقطقه', 'صوت', 'تطق', 'دقدقه', 'knock', 'ping', 'noise', 'ticking', 'rattle'],
        codes: { P0325: 4, P0011: 3, P0016: 3, P0300: 2 },
        ask: { ar: 'الصوت يزيد مع الدوس على البنزين، ولا يطلع بس وقت التشغيل والمكينة باردة؟', en: 'Does the noise get louder when you accelerate, or only on a cold start?' }
    },
    {
        id: 'idle', label: 'Unstable idle (RPM goes up and down)', ar: 'سلانسيه غير ثابت', urgency: 'drive',
        words: ['السلانسيه', 'سلانسيه', 'الدورات', 'الدوره', 'العداد ينزل', 'واقفه', 'rpm', 'idle', 'revs', 'standing still'],
        codes: { P0505: 5, P0506: 4, P0507: 4, P0171: 2 },
        ask: { ar: 'السلانسيه يزيد وينقص وقت تشغيل المكيف؟', en: 'Does the idle go up and down when you turn the AC on?' }
    },
    {
        id: 'abs', label: 'ABS or brake warning light', ar: 'لمبة ABS', urgency: 'soon',
        words: ['اي بي اس', 'ايه بي اس', 'لمبة الفرامل', 'لمبة البريك', 'انتي لوك', 'abs', 'anti-lock', 'antilock', 'wheel speed', 'traction light'],
        codes: { C0035: 4, C0040: 4, C0045: 3, C0050: 3, C0245: 3, C0265: 2, C0110: 2, U0121: 2, C0161: 1 },
        ask: { ar: 'لمبة الـ ABS شابة على طول، ولا تطلع وتختفي؟ وتطلع أكثر بعد المطبات أو المطر؟', en: 'Is the ABS light on all the time, or does it come and go? Does it show up more after bumps or rain?' }
    }
];

const FAMILIES = {
    airFuel: {
        codes: ['P0171', 'P0172', 'P0101', 'P0133', 'P0087', 'P0230'],
        parts: ['maf', 'fuelPump', 'o2'],
        ar: 'خليط الهوا والبنزين مو مضبوط، يعني المكينة تاخذ هوا زيادة أو بنزين ناقص (أو العكس).',
        en: 'the air and fuel mix is off, the engine is getting too much air or too little fuel (or the reverse).',
        stepsAr: 'تنظيف حساس الهوا (MAF)، بعدين فحص تهريب الهوا في الليات، بعدين فلتر وطرمبة البنزين.',
        stepsEn: 'clean the air flow sensor (MAF), check for vacuum leaks in the hoses, then the fuel filter and fuel pump.',
        questionsAr: ['نظفتوا حساس الهوا قبل ما تبدلونه؟', 'فحصتوا تهريب الهوا في الليات؟', 'ممكن أشوف قراءة الـ Fuel trim على الجهاز؟'],
        questionsEn: ['Did you clean the MAF sensor before replacing it?', 'Did you check for vacuum leaks?', 'Can I see the fuel trim reading on the scanner?'],
        avoidAr: 'تبديل الدبة أو قطع المكينة قبل فحص الحساسات والليات.',
        avoidEn: 'Replacing the catalytic converter or engine parts before the sensors and hoses are checked.'
    },
    ignition: {
        codes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0325'],
        parts: ['plugs', 'coils', 'knock'],
        ar: 'في سلندر أو أكثر ما يحترق صح (Misfire)، وهذا يسبب الرجفة.',
        en: 'one or more cylinders are not firing properly (misfire), which causes the shaking.',
        stepsAr: 'البواجي (الشمعات)، بعدين الكويلات، بعدين البخاخات.',
        stepsEn: 'spark plugs, then ignition coils, then fuel injectors.',
        questionsAr: ['أي سلندر فيه المشكلة؟', 'بدلتوا الكويل من سلندر لسلندر عشان تتأكدون؟', 'متى آخر مرة تبدلت البواجي؟'],
        questionsEn: ['Which cylinder is misfiring?', 'Did you swap the coil to another cylinder to confirm?', 'When were the spark plugs last changed?'],
        avoidAr: 'تبديل كل الكويلات أو فتح المكينة قبل تجربة البواجي.',
        avoidEn: 'Replacing every coil or opening the engine before trying new spark plugs.'
    },
    idle: {
        codes: ['P0505', 'P0506', 'P0507', 'P0122', 'P0121'],
        parts: ['throttle'],
        ar: 'نظام التحكم بالسلانسيه أو بوابة الهوا (Throttle) ما يضبط الدورات وهي واقفة.',
        en: 'the idle control or throttle is not holding the RPM steady at idle.',
        stepsAr: 'تنظيف بوابة الهوا (الثروتل) وصمام السلانسيه، بعدين فحص حساس الثروتل.',
        stepsEn: 'clean the throttle body and idle valve, then check the throttle sensor.',
        questionsAr: ['نظفتوا الثروتل قبل ما تبدلونه؟', 'سويتوا Idle relearn بعد التنظيف؟', 'في تهريب هوا؟'],
        questionsEn: ['Did you clean the throttle body before replacing it?', 'Did you run an idle relearn after cleaning?', 'Is there a vacuum leak?'],
        avoidAr: 'تبديل الثروتل كامل قبل تنظيفه.',
        avoidEn: 'Replacing the whole throttle body before cleaning it.'
    },
    sensors: {
        codes: ['P0335', 'P0340', 'P0011', 'P0016'],
        parts: ['crank', 'cam'],
        ar: 'الكمبيوتر ما يقرأ مكان الكرنك أو الكامات صح، فيتلخبط توقيت الاشتعال.',
        en: 'the computer is not reading the crankshaft or camshaft position correctly, so ignition timing goes wrong.',
        stepsAr: 'فحص حساس الكرنك والكامات وأسلاكهم، بعدين زيت المكينة (مستواه ونظافته) لأنه يأثر على التوقيت.',
        stepsEn: 'check the crank and cam sensors and their wiring, then the engine oil level and condition, which affects timing.',
        questionsAr: ['فحصتوا الأسلاك قبل الحساس؟', 'مستوى الزيت ونظافته زينة؟', 'المشكلة في الحساس ولا في سير التايمن؟'],
        questionsEn: ['Did you check the wiring before the sensor?', 'Is the oil level and condition good?', 'Is it the sensor or the timing belt or chain?'],
        avoidAr: 'تبديل سير أو جنزير التايمن بدون فحص يثبت إن فيه مشكلة.',
        avoidEn: 'Replacing the timing belt or chain without a test that proves it is the problem.'
    },
    exhaust: {
        codes: ['P0420', 'P0442', 'P0455', 'P0299'],
        parts: ['cat', 'o2'],
        ar: 'المشكلة في الشكمان أو الدبة (الكتلايزر) أو نظام أبخرة البنزين.',
        en: 'the problem is in the exhaust, the catalytic converter, or the fuel vapor system.',
        stepsAr: 'التأكد إن غطا البنزين مسكّر زين، بعدين حساسات الأكسجين، وآخر شي الدبة لأنها غالية.',
        stepsEn: 'make sure the fuel cap is tight, then the oxygen sensors, and the catalytic converter last because it is expensive.',
        questionsAr: ['فحصتوا حساسات الأكسجين قبل الدبة؟', 'في تهريب في الشكمان؟', 'ممكن أشوف قراءة الحساسين على الجهاز؟'],
        questionsEn: ['Did you test the oxygen sensors before the converter?', 'Is there an exhaust leak?', 'Can I see both O2 sensor readings on the scanner?'],
        avoidAr: 'تبديل الدبة (غالية) قبل فحص حساسات الأكسجين وغطا البنزين.',
        avoidEn: 'Replacing the catalytic converter (expensive) before checking the oxygen sensors and fuel cap.'
    },
    cooling: {
        codes: ['P0217', 'P0128', 'P0117', 'P0118', 'P0480'],
        parts: ['thermostat', 'fan', 'coolantSensor'],
        ar: 'نظام التبريد مو قاعد يبرد المكينة صح.',
        en: 'the cooling system is not keeping the engine cool.',
        stepsAr: 'إيقاف السيارة وتبريدها، بعدين فحص مستوى الماي، ومروحة الرديتر، والثرموستات.',
        stepsEn: 'stop and let it cool down, then check the coolant level, the radiator fan, and the thermostat.',
        questionsAr: ['في تهريب ماي؟', 'المروحة تشتغل؟', 'الثرموستات يفتح؟'],
        questionsEn: ['Is there a coolant leak?', 'Does the fan turn on?', 'Does the thermostat open?'],
        avoidAr: 'تبديل الرديتر أو فتح المكينة قبل فحص الثرموستات والمروحة.',
        avoidEn: 'Replacing the radiator or opening the engine before checking the thermostat and fan.'
    },
    transmission: {
        codes: ['P0700', 'P0730', 'P0715', 'P0740', 'P0750'],
        parts: ['gearbox'],
        ar: 'كمبيوتر القير لقى مشكلة في التبديل أو في حساسات القير.',
        en: 'the gearbox computer found a problem with shifting or its sensors.',
        stepsAr: 'فحص مستوى زيت القير ولونه (إذا محروق أو أسود يتبدل)، بعدين حساسات السرعة.',
        stepsEn: 'check the gearbox oil level and color (replace it if it is dark or burnt), then the speed sensors.',
        questionsAr: ['شنو الكود الثاني اللي مع P0700؟', 'زيت القير محروق؟', 'المشكلة في حساس ولا في القير نفسه؟'],
        questionsEn: ['What is the second code stored with P0700?', 'Is the gearbox oil burnt?', 'Is it a sensor or the gearbox itself?'],
        avoidAr: 'تبديل القير كامل قبل قراءة كود القير الثاني وفحص الزيت والحساسات.',
        avoidEn: 'Replacing the whole gearbox before reading the second code and checking the oil and sensors.'
    },
    electrical: {
        codes: ['P0562', 'P0563', 'P0620', 'P0622'],
        parts: ['battery'],
        ar: 'الكهرباء في السيارة مو ثابتة، غالبًا من البطارية أو الدينمو.',
        en: 'the car voltage is not stable, usually from the battery or the alternator.',
        stepsAr: 'تنظيف أقطاب البطارية وفحصها، بعدين فحص شحن الدينمو.',
        stepsEn: 'clean and test the battery terminals, then test the alternator charging.',
        questionsAr: ['فحصتوا البطارية بجهاز؟', 'كم يشحن الدينمو (فولت)؟', 'الأقطاب نظيفة؟'],
        questionsEn: ['Did you test the battery with a tester?', 'What voltage is the alternator charging at?', 'Are the terminals clean?'],
        avoidAr: 'تبديل الدينمو قبل فحص البطارية والأقطاب.',
        avoidEn: 'Replacing the alternator before testing the battery and terminals.'
    },
    abs: {
        codes: ['C0035', 'C0040', 'C0045', 'C0050', 'C0245', 'C0110', 'C0121', 'C0265', 'C0161', 'U0121', 'U0415'],
        parts: ['absSensor', 'absModule'],
        ar: 'نظام منع انغلاق الفرامل (ABS) فيه خلل وطفى. الفرامل العادية تشتغل، بس الـ ABS ما بيساعدك وقت الفرملة القوية.',
        en: 'the anti-lock brake system (ABS) has a fault and switched itself off. Normal brakes still work, but ABS will not help in a hard stop.',
        stepsAr: 'الفيشة والسلك عند حساس الكفر أول (أرخص شي وغالبًا هي السبب)، بعدين تنظيف الحساس، بعدين مقارنة قراءة الحساسات الأربعة بالجهاز، وآخر شي كمبيوتر الـ ABS.',
        stepsEn: 'the connector and wire at the wheel sensor first (cheapest, and often the cause), then clean the sensor, then compare all four sensor readings on the scanner, and the ABS module last.',
        questionsAr: ['أي كفر فيه المشكلة؟', 'فحصتوا الفيشة والسلك قبل ما تبدلون الحساس؟', 'ممكن أشوف قراءة الحساسات الأربعة على الجهاز وقت المشي؟'],
        questionsEn: ['Which wheel has the fault?', 'Did you check the connector and wire before replacing the sensor?', 'Can I see all four wheel speed readings on the scanner while driving?'],
        avoidAr: 'تبديل كمبيوتر أو طرمبة الـ ABS (غالية وايد) قبل فحص الفيش والحساسات.',
        avoidEn: 'Replacing the ABS module or pump (very expensive) before checking the connectors and sensors.'
    }
};

const URGENCY_ORDER = ['stop', 'soon', 'unknown', 'drive'];

const g = (gender, male, female, neutral) => (gender === 'male' ? male : gender === 'female' ? female : neutral);

const urgencyText = (urgency, lang, gender) => {
    if (lang !== 'ar') {
        return {
            stop: '⚠️ Do not drive until it is checked, it can cause more damage or put you at risk.',
            soon: 'You can drive short distances, but take it to a workshop soon.',
            drive: 'Not dangerous right now, but do not ignore it.',
            unknown: 'Have it scanned with an OBD reader to know for sure.'
        }[urgency];
    }
    return {
        stop: `⚠️ ${g(gender, 'لا تسوق السيارة', 'لا تسوقين السيارة', 'لا يُنصح بقيادة السيارة')} لين تنفحص، ممكن تسبب ضرر أكبر أو خطر.`,
        soon: g(gender, 'تقدر تسوقها مسافات قصيرة، بس ودها الورشة قريب.', 'تقدرين تسوقينها مسافات قصيرة، بس وديها الورشة قريب.', 'ممكن القيادة مسافات قصيرة، بس تحتاج ورشة قريب.'),
        drive: g(gender, 'مو خطيرة الحين، بس لا تطنشها.', 'مو خطيرة الحين، بس لا تطنشينها.', 'مو خطيرة الحين، بس لازم تنصلح.'),
        unknown: g(gender, 'خلها تنفحص بجهاز OBD عشان نعرف بالضبط.', 'خليها تنفحص بجهاز OBD عشان نعرف بالضبط.', 'تحتاج فحص بجهاز OBD عشان نعرف بالضبط.')
    }[urgency];
};

const normalize = (text) => String(text || '')
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ');

const toMatcher = (word) => {
    const w = normalize(word);
    if (!/^[\x00-\x7F]+$/.test(w)) return (input) => input.includes(w);
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    return (input) => re.test(input);
};

const PREPARED = SYMPTOMS.map((s) => ({ ...s, matchers: s.words.map(toMatcher) }));
const ENGINE_WORDS = ['المكينه', 'مكينه', 'engine', 'check engine'].map(toMatcher);

const isArabic = (text) => /[؀-ۿ]/.test(String(text || ''));

const familyOf = (code) => Object.values(FAMILIES).find((f) => f.codes.includes(code)) || null;

const think = (messages) => {
    const inputs = [].concat(messages).map(normalize);
    const matched = [];
    const scores = {};

    const hits = PREPARED
        .map((symptom) => ({ symptom, at: inputs.map((input) => symptom.matchers.some((match) => match(input))) }))
        .filter((hit) => hit.at.includes(true));
    const aboutEngine = inputs.some((input) => ENGINE_WORDS.some((match) => match(input)));
    const hasAbs = hits.some((hit) => hit.symptom.id === 'abs');

    hits.forEach(({ symptom, at }) => {
        if (symptom.id === 'light' && hasAbs && !aboutEngine) return;
        const boost = at[at.length - 1] ? 2 : 1;
        matched.push({ id: symptom.id, label: symptom.label, ar: symptom.ar, urgency: symptom.urgency, ask: symptom.ask });
        Object.entries(symptom.codes).forEach(([code, weight]) => {
            if (!scores[code]) scores[code] = { code, score: 0, because: [] };
            scores[code].score += weight * boost;
            scores[code].because.push(symptom.label);
        });
    });

    const candidates = Object.values(scores).sort((a, b) => b.score - a.score);
    const urgency = URGENCY_ORDER.find((u) => matched.some((m) => m.urgency === u)) || null;
    return { matched, candidates, urgency };
};

const reply = ({ lang, symptoms, top, urgency, carName, asked = [], gender, level = 'beginner' }) => {
    const ar = lang === 'ar';
    const lines = [];

    if (symptoms.length && level !== 'expert') {
        const list = symptoms.map((s) => (ar ? s.ar : s.label.toLowerCase())).join(ar ? '، و' : ', ');
        const car = carName
            ? `الـ ${carName} ${g(gender, 'حقتك', 'حقتج', '')}`.trim()
            : g(gender, 'سيارتك', 'سيارتج', 'السيارة');
        lines.push(ar ? `فهمت إن ${car} فيها: ${list}.` : `So your ${carName || 'car'} has: ${list}.`);
    }

    if (top) {
        const family = familyOf(top.code);
        const pct = top.confidence ? ` (${top.confidence}%)` : '';
        if (family) {
            lines.push(ar
                ? `${symptoms.length > 1 ? 'لما تجتمع هالأعراض مع بعض، ' : ''}غالبًا ${family.ar} أقرب احتمال هو ${top.code}${pct}: ${top.name}.`
                : `${symptoms.length > 1 ? 'Put together, ' : ''}most likely ${family.en} The closest match is ${top.code}${pct}: ${top.name}.`);
            lines.push(ar
                ? `${g(gender, 'ابدأ بالأرخص', 'ابدئي بالأرخص', 'الأفضل البداية بالأرخص')}: ${family.stepsAr}`
                : `Start with the cheapest: ${family.stepsEn}`);
            if (level === 'beginner') {
                lines.push(ar
                    ? `${g(gender, 'اسأل الميكانيكي', 'اسألي الميكانيكي', 'سؤال مهم للميكانيكي')}: "${family.questionsAr[0]}"`
                    : `Ask the mechanic: "${family.questionsEn[0]}"`);
            }
        } else {
            lines.push(ar
                ? `أقرب احتمال هو ${top.code}${pct}: ${top.name}.`
                : `The closest match is ${top.code}${pct}: ${top.name}.`);
        }
        if (top.hadBefore) {
            lines.push(ar
                ? `${g(gender, 'وانتبه', 'وانتبهي', 'ملاحظة')}: هالكود طلع في ${g(gender, 'سيارتك', 'سيارتج', 'السيارة')} قبل، يعني يمكن التصليح الأول ما حل السبب.`
                : 'Note: this code showed up on your car before, so the last repair may not have fixed the cause.');
        }
        if (top.seen) {
            lines.push(ar
                ? `${top.seen} ${top.seen === 1 ? 'سائق' : 'سواق'} ثانيين سجلوا نفس الكود.`
                : `${top.seen} other driver${top.seen === 1 ? '' : 's'} logged the same code.`);
        }
    }

    if (urgency) lines.push(urgencyText(urgency, lang, gender));

    const next = symptoms.find((s) => s.ask && !asked.includes(s.id));
    return {
        text: lines.join(' '),
        followUp: next ? { id: next.id, text: ar ? next.ask.ar : next.ask.en } : null
    };
};

const PARTS = [
    {
        id: 'o2', ar: 'حساس الأكسجين (O2 sensor)', en: 'Oxygen sensor (O2 sensor)',
        words: ['اكسجين', 'الاكسجين', 'حساس الشكمان', 'o2', 'oxygen', 'lambda'],
        whereAr: 'مركّب على الشكمان تحت السيارة. عادة واحد قبل الدبة (الكتلايزر) وواحد بعدها، وفي المكاين V6 وV8 تلقى 4.',
        whereEn: 'Screwed into the exhaust pipe under the car. Usually one before the catalytic converter and one after it; V6 and V8 engines have four.',
        jobAr: 'يقيس الأكسجين في العادم عشان الكمبيوتر يضبط خليط البنزين.',
        jobEn: 'Measures oxygen in the exhaust so the computer can adjust the fuel mix.',
        codes: ['P0130', 'P0133', 'P0135', 'P0136', 'P0141']
    },
    {
        id: 'maf', ar: 'حساس الهوا (MAF)', en: 'Mass air flow sensor (MAF)',
        words: ['حساس الهوا', 'حساس الهواء', 'maf', 'air flow', 'airflow'],
        whereAr: 'بين فلتر الهوا وبوابة الهوا (الثروتل)، على ماسورة الهوا الداخلة للمكينة.',
        whereEn: 'Between the air filter box and the throttle body, on the intake pipe.',
        jobAr: 'يقيس كمية الهوا الداخلة للمكينة.',
        jobEn: 'Measures how much air goes into the engine.',
        codes: ['P0100', 'P0101', 'P0102', 'P0103']
    },
    {
        id: 'throttle', ar: 'بوابة الهوا (Throttle body)', en: 'Throttle body',
        words: ['ثروتل', 'الثروتل', 'بوابة الهوا', 'بوابه الهوا', 'throttle'],
        whereAr: 'على مدخل الهوا فوق المكينة، بعد حساس الهوا.',
        whereEn: 'On the air intake on top of the engine, after the MAF sensor.',
        jobAr: 'تفتح وتسكر حسب دوسة البنزين عشان تتحكم بالهوا.',
        jobEn: 'Opens and closes with the gas pedal to control air.',
        codes: ['P0121', 'P0122', 'P0505', 'P2135']
    },
    {
        id: 'plugs', ar: 'البواجي (الشمعات)', en: 'Spark plugs',
        words: ['بواجي', 'البواجي', 'بوجي', 'شمعات', 'الشمعات', 'spark plug', 'plugs'],
        whereAr: 'فوق المكينة، واحدة لكل سلندر، تحت الكويلات.',
        whereEn: 'On top of the engine, one per cylinder, under the ignition coils.',
        jobAr: 'تعطي الشرارة اللي تحرق البنزين.',
        jobEn: 'Make the spark that burns the fuel.',
        codes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304']
    },
    {
        id: 'coils', ar: 'الكويلات', en: 'Ignition coils',
        words: ['كويل', 'الكويل', 'كويلات', 'الكويلات', 'coil'],
        whereAr: 'فوق المكينة، فوق كل بوجي مباشرة.',
        whereEn: 'On top of the engine, sitting right on each spark plug.',
        jobAr: 'ترفع الكهربا عشان البوجي يطلع شرارة.',
        jobEn: 'Boost the voltage so the spark plug can fire.',
        codes: ['P0351', 'P0352', 'P0353', 'P0300']
    },
    {
        id: 'cat', ar: 'الدبة (الكتلايزر)', en: 'Catalytic converter',
        words: ['الدبه', 'دبه', 'كتلايزر', 'الكتلايزر', 'catalytic', 'converter', 'catalyst'],
        whereAr: 'تحت السيارة على الشكمان، قريبة من المكينة وبين حساسين الأكسجين.',
        whereEn: 'Under the car on the exhaust, close to the engine, between the two oxygen sensors.',
        jobAr: 'تنظف غازات العادم قبل ما تطلع.',
        jobEn: 'Cleans the exhaust gases before they leave the car.',
        codes: ['P0420', 'P0430']
    },
    {
        id: 'thermostat', ar: 'الثرموستات', en: 'Thermostat',
        words: ['ثرموستات', 'الثرموستات', 'ثيرموستات', 'thermostat'],
        whereAr: 'في مكان دخول ماسورة الرديتر العلوية للمكينة، تحت غطا صغير.',
        whereEn: 'Where the upper radiator hose meets the engine, under a small housing.',
        jobAr: 'تفتح طريق الماي للرديتر لما المكينة تحمى.',
        jobEn: 'Opens the coolant path to the radiator when the engine warms up.',
        codes: ['P0128', 'P0125']
    },
    {
        id: 'fan', ar: 'مروحة الرديتر', en: 'Radiator fan',
        words: ['مروحه', 'المروحه', 'مروحة الرديتر', 'فان', 'radiator fan', 'cooling fan'],
        whereAr: 'ورا الرديتر في مقدمة السيارة.',
        whereEn: 'Behind the radiator at the front of the car.',
        jobAr: 'تسحب هوا على الرديتر عشان تبرد الماي.',
        jobEn: 'Pulls air through the radiator to cool the coolant.',
        codes: ['P0480', 'P0481']
    },
    {
        id: 'coolantSensor', ar: 'حساس حرارة الماي', en: 'Coolant temperature sensor',
        words: ['حساس الحراره', 'حساس حرارة الماي', 'حساس الماي', 'coolant sensor', 'ect sensor', 'temperature sensor'],
        whereAr: 'على المكينة قريب من الثرموستات.',
        whereEn: 'On the engine, near the thermostat housing.',
        jobAr: 'يقول للكمبيوتر حرارة المكينة.',
        jobEn: 'Tells the computer the engine temperature.',
        codes: ['P0115', 'P0117', 'P0118']
    },
    {
        id: 'crank', ar: 'حساس الكرنك', en: 'Crankshaft position sensor',
        words: ['الكرنك', 'كرنك', 'حساس الكرنك', 'crankshaft', 'crank sensor', 'ckp'],
        whereAr: 'تحت المكينة قريب من البكرة الأمامية أو القير.',
        whereEn: 'Low on the engine, near the front pulley or the transmission.',
        jobAr: 'يقول للكمبيوتر وين الكرنك عشان يضبط الشرارة والبنزين. إذا خرب ممكن السيارة ما تشتغل.',
        jobEn: 'Tells the computer the crankshaft position for spark and fuel timing. If it fails the car may not start.',
        codes: ['P0335', 'P0336']
    },
    {
        id: 'cam', ar: 'حساس الكامات', en: 'Camshaft position sensor',
        words: ['الكامات', 'كامات', 'حساس الكامات', 'camshaft', 'cam sensor', 'cmp'],
        whereAr: 'فوق المكينة عند غطا البلوف (الكامات).',
        whereEn: 'At the top of the engine, on the valve cover.',
        jobAr: 'يقول للكمبيوتر مكان الكامات عشان توقيت البلوف.',
        jobEn: 'Tells the computer the camshaft position for valve timing.',
        codes: ['P0340', 'P0341']
    },
    {
        id: 'fuelPump', ar: 'طرمبة البنزين', en: 'Fuel pump',
        words: ['طرمبه', 'الطرمبه', 'طرمبة البنزين', 'fuel pump'],
        whereAr: 'داخل تانكي البنزين، وغالبًا توصل لها من تحت الكرسي الخلفي.',
        whereEn: 'Inside the fuel tank, usually reached from under the rear seat.',
        jobAr: 'تدز البنزين من التانكي للمكينة.',
        jobEn: 'Pushes fuel from the tank to the engine.',
        codes: ['P0230', 'P0087']
    },
    {
        id: 'battery', ar: 'البطارية والدينمو', en: 'Battery and alternator',
        words: ['البطاريه', 'بطاريه', 'الدينمو', 'دينمو', 'battery', 'alternator'],
        whereAr: 'البطارية في غرفة المكينة (بعض السيارات في الشنطة)، والدينمو على المكينة ويلفه السير.',
        whereEn: 'The battery is in the engine bay (some cars keep it in the trunk); the alternator is on the engine, driven by the belt.',
        jobAr: 'البطارية تشغل السيارة، والدينمو يشحنها وهي شغالة.',
        jobEn: 'The battery starts the car; the alternator charges it while it runs.',
        codes: ['P0562', 'P0563', 'P0620']
    },
    {
        id: 'knock', ar: 'حساس الطقطقة (Knock sensor)', en: 'Knock sensor',
        words: ['حساس الطقطقه', 'knock sensor'],
        whereAr: 'مربوط على جسم المكينة، غالبًا تحت مجمع الهوا.',
        whereEn: 'Bolted to the engine block, often under the intake manifold.',
        jobAr: 'يسمع الطقطقة في المكينة عشان الكمبيوتر يأخر الشرارة.',
        jobEn: 'Listens for engine knock so the computer can retard the spark.',
        codes: ['P0325', 'P0330']
    },
    {
        id: 'absSensor', ar: 'حساس الـ ABS (حساس سرعة الكفر)', en: 'ABS wheel speed sensor',
        words: ['حساس abs', 'حساس الاي بي اس', 'حساس الكفر', 'حساس سرعة الكفر', 'حساس الويل', 'wheel speed sensor', 'abs sensor', 'speed sensor'],
        whereAr: 'واحد عند كل كفر، ورا الديسك قريب من البيرنق، وسلكه ماشي مع لي الفرامل.',
        whereEn: 'One at each wheel, behind the brake disc near the wheel bearing, with its wire running along the brake hose.',
        jobAr: 'يقيس سرعة كل كفر، عشان الكمبيوتر يعرف إذا كفر بيقفل وقت الفرملة.',
        jobEn: 'Measures the speed of each wheel so the computer knows when a wheel is about to lock while braking.',
        tipAr: 'قبل ما تبدله: افحص الفيشة والسلك عند الكفر. كثير مرات تكون الفيشة وسخة أو مرتخية أو السلك مقطوع، أو الحساس عليه وسخ وبرادة حديد من الفرامل، والتنظيف يحلها.',
        tipEn: 'Before replacing it: check the connector and wire at the wheel. Very often the plug is dirty, loose or the wire is cut, or the sensor is covered in brake dust and metal, and cleaning fixes it.',
        codes: ['C0035', 'C0040', 'C0045', 'C0050', 'C0245']
    },
    {
        id: 'absModule', ar: 'كمبيوتر وطرمبة الـ ABS', en: 'ABS module and pump', ownCodesOnly: true,
        words: ['اي بي اس', 'ايه بي اس', 'كمبيوتر الفرامل', 'طرمبة الفرامل', 'abs module', 'abs pump', 'abs unit', 'abs'],
        whereAr: 'في مكينة السيارة قريب من علبة زيت الفرامل، وتطلع منه ليات الفرامل لكل كفر.',
        whereEn: 'In the engine bay near the brake fluid reservoir, with a brake line going out to each wheel.',
        jobAr: 'يقرا الحساسات الأربعة، ولما كفر يبي يقفل يخفف ويرجع الضغط عليه بسرعة عشان ما تتزحلق.',
        jobEn: 'Reads the four wheel sensors and, when a wheel is about to lock, pulses the brake pressure on it so the car does not skid.',
        tipAr: 'هذي من أغلى القطع. قبل ما تبدلها: افحص الفيوز والفيش والسلك الأرضي، وتأكد إن الحساسات الأربعة تقرا صح. أغلب المرات المشكلة في حساس أو فيشة مو في الكمبيوتر.',
        tipEn: 'This is one of the most expensive parts. Before replacing it: check the fuse, the connectors and the ground wire, and make sure all four sensors read correctly. Most of the time the problem is a sensor or a plug, not the module.',
        codes: ['C0110', 'C0121', 'C0265', 'C0161', 'U0121', 'U0415']
    },
    {
        id: 'gearbox', ar: 'القير', en: 'Gearbox (transmission)',
        words: ['القير', 'قير', 'الجير', 'gearbox', 'transmission'],
        whereAr: 'تحت السيارة ورا المكينة، ومربوط فيها.',
        whereEn: 'Under the car, bolted to the back of the engine.',
        jobAr: 'ينقل قوة المكينة للتواير ويبدل الغيارات.',
        jobEn: 'Sends engine power to the wheels and changes gears.',
        codes: ['P0700', 'P0715', 'P0730', 'P0740', 'P0750']
    }
].map((p) => ({ ...p, matchers: p.words.map(toMatcher) }));

const findPart = (text) => {
    const input = normalize(text);
    return PARTS.find((p) => p.matchers.some((match) => match(input))) || null;
};

const partReply = (part, lang) => {
    const ar = lang === 'ar';
    const tip = ar ? part.tipAr : part.tipEn;
    const text = ar
        ? `${part.ar}: ${part.whereAr} شغلته: ${part.jobAr} الأكواد المرتبطة فيه: ${part.codes.join('، ')}.`
        : `${part.en}: ${part.whereEn} What it does: ${part.jobEn} Related codes: ${part.codes.join(', ')}.`;
    return tip ? `${text} ${tip}` : text;
};

const OIL_WORDS = ['غيار زيت', 'زيت المكينه', 'تبديل الزيت', 'نبدل الزيت', 'oil change', 'change the oil', 'engine oil'].map(toMatcher);

const beforeYouGo = (code) => {
    const family = familyOf(code);
    if (!family) {
        return {
            plainEn: 'this code is not in one of the groups the assistant knows yet.',
            stepsEn: 'ask the workshop to show you the code on their scanner and explain what they will check first.',
            questionsEn: ['What does this code mean exactly?', 'What will you check first, and how much does the check cost?', 'Can I keep the old part?'],
            avoidEn: 'Paying for a repair before they explain how it is linked to the code.'
        };
    }
    return { plainEn: family.en, stepsEn: family.stepsEn, questionsEn: family.questionsEn, avoidEn: family.avoidEn };
};

const showMeAr = (gender) => g(
    gender,
    'اطلب منهم يورونك الكود على جهاز الفحص',
    'اطلبي منهم يورونج الكود على جهاز الفحص',
    'الأفضل الطلب منهم إنهم يورون الكود على جهاز الفحص'
);

const checkClaim = ({ text, openCodes = [], lastOil = null, carMileage = null, lang = 'en', gender }) => {
    const ar = lang === 'ar';
    const input = normalize(text);

    if (OIL_WORDS.some((match) => match(input)) && lastOil) {
        const months = (Date.now() - new Date(lastOil.date)) / (30 * 24 * 60 * 60 * 1000);
        const km = lastOil.mileage != null && carMileage != null ? carMileage - lastOil.mileage : null;
        if (months < 5 && (km == null || km < 8000)) {
            const count = Math.max(1, Math.round(months));
            const ago = km != null
                ? (ar ? `${km.toLocaleString()} كم` : `${km.toLocaleString()} km`)
                : (ar ? `${count} شهر` : `${count} month${count === 1 ? '' : 's'}`);
            return {
                verdict: 'warning',
                text: ar
                    ? `⚠️ آخر غيار زيت كان قبل ${ago} بس، يعني بعد ما حان وقته. ${g(gender, 'اسأله', 'اسأليه', 'السؤال المهم')}: "ليش نحتاج نغيره الحين؟"`
                    : `⚠️ The last oil change was only ${ago} ago, so it is not due yet. Ask them: "Why does it need changing now?"`
            };
        }
    }

    const part = findPart(text);
    if (!part) {
        return {
            verdict: 'unknown',
            text: ar
                ? `ما قدرت أعرف القطعة من الكلام. ${showMeAr(gender)}، ويشرحون شلون القطعة مرتبطة فيه.`
                : 'I could not tell which part they mean. Ask them to show you the code on their scanner and explain how the part is linked to it.'
        };
    }

    const name = ar ? part.ar : part.en;
    const related = openCodes.filter((c) => part.codes.includes(c)
        || (!part.ownCodesOnly && familyOf(c) && familyOf(c).parts.includes(part.id)));
    const tip = ar ? part.tipAr : part.tipEn;
    const withTip = (text) => (tip ? `${text} ${tip}` : text);
    if (related.length) {
        const text = ar
            ? `✅ منطقي: ${name} مرتبطة بالكود ${related.join('، ')} اللي في السيارة. ${g(gender, 'اسأله', 'اسأليه', 'سؤال مهم')}: "فحصتوها قبل ما تبدلونها؟" ${g(gender, 'واطلب', 'واطلبي', 'والأفضل طلب')} القطعة القديمة.`
            : `✅ Makes sense: the ${part.en} is linked to ${related.join(', ')} on this car. Ask: "Did you test it before replacing it?" and ask to keep the old part.`;
        return { verdict: 'ok', text: withTip(text) };
    }
    if (!openCodes.length) {
        return {
            verdict: 'warning',
            text: withTip(ar
                ? `⚠️ ما في أي عطل مفتوح مسجل على السيارة. قبل تبديل ${name}، ${showMeAr(gender)}.`
                : `⚠️ There are no open faults logged on this car. Before replacing the ${part.en}, ask them to show you the code on their scanner.`)
        };
    }
    return {
        verdict: 'warning',
        text: withTip(ar
            ? `⚠️ ${name} ما لها علاقة مباشرة بالأعطال المسجلة (${openCodes.join('، ')}). ${g(gender, 'اسأله', 'اسأليه', 'السؤال المهم')}: "شلون هالقطعة مرتبطة بالعطل؟" و${g(gender, 'لا تدفع', 'لا تدفعين', 'الأفضل عدم الدفع')} لين يشرحون.`
            : `⚠️ The ${part.en} is not directly linked to the logged faults (${openCodes.join(', ')}). Ask: "How is this part linked to the fault?" and do not pay until they explain.`)
    };
};

module.exports = { think, reply, isArabic, familyOf, findPart, partReply, beforeYouGo, checkClaim, SYMPTOMS, URGENCY_ORDER };
