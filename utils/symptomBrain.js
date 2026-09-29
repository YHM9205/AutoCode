
const SYMPTOMS = [
    {
        id: 'shaking', label: 'Shaking or misfiring', ar: 'رجفة', urgency: 'soon',
        words: ['ترجف', 'رجفه', 'يرجف', 'تهتز', 'اهتزاز', 'رعشه', 'تتنفض', 'shake', 'shaking', 'vibrat', 'misfire', 'rough idle', 'rough'],
        codes: { P0300: 5, P0301: 3, P0302: 3, P0303: 3, P0304: 3, P0171: 2, P0101: 1 },
        ask: { ar: 'الرجفة تصير وهي واقفة (سلانسيه) ولا وإنت ماشي وتدوس بنزين؟', en: 'Does it shake while standing still (idle) or while driving and accelerating?' }
    },
    {
        id: 'stalling', label: 'Engine stalls or turns off', ar: 'انطفاء', urgency: 'stop',
        words: ['تطفي', 'طفت', 'تنطفي', 'ينطفي', 'انطفت', 'تموت', 'stall', 'dies', 'shuts off', 'turns off', 'cuts out'],
        codes: { P0505: 4, P0335: 4, P0101: 3, P0171: 2, P0122: 2, P0230: 2 },
        ask: { ar: 'تطفي وهي واقفة عند الإشارة، ولا حتى وإنت ماشي؟', en: 'Does it turn off when you stop at a light, or even while driving?' }
    },
    {
        id: 'no-start', label: 'Hard to start or will not start', ar: 'صعوبة تشغيل', urgency: 'soon',
        words: ['ما تشتغل', 'ماتشتغل', 'صعب تشتغل', 'ما تدور', 'ماتدور', 'تتاخر تشتغل', 'won\'t start', 'wont start', 'hard start', 'no start', 'not start', 'cranks'],
        codes: { P0335: 5, P0340: 4, P0230: 3, P0562: 3, P0087: 2 },
        ask: { ar: 'لما تشغلها، المكينة تدور (تسمع صوت السلف) بس ما تشتغل، ولا ما تسوي أي صوت؟', en: 'When you turn the key, does the engine crank but not start, or does nothing happen at all?' }
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
        ask: { ar: 'السيارة تيربو؟ وهل تحس بريحة أو دخان من الشكمان؟', en: 'Is the car turbocharged? Any smell or smoke from the exhaust?' }
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
        ask: { ar: 'اللمبة ثابتة ولا تومض؟ (إذا تومض لا تسوق السيارة)', en: 'Is the light steady or flashing? (If it flashes, do not drive.)' }
    },
    {
        id: 'electric', label: 'Battery or electrical problem', ar: 'مشكلة كهرباء', urgency: 'soon',
        words: ['بطاريه', 'كهربا', 'الدينمو', 'دينمو', 'تفصل', 'battery', 'electrical', 'alternator', 'charging', 'dim'],
        codes: { P0562: 5, P0563: 3, P0620: 3, P0622: 2 },
        ask: { ar: 'الأنوار تضعف لما تشغل المكيف أو وإنت واقف؟', en: 'Do the lights dim when the AC is on or at idle?' }
    },
    {
        id: 'noise', label: 'Knocking or engine noise', ar: 'صوت أو طقطقة', urgency: 'soon',
        words: ['طقطقه', 'صوت', 'تطق', 'دقدقه', 'knock', 'ping', 'noise', 'ticking', 'rattle'],
        codes: { P0325: 4, P0011: 3, P0016: 3, P0300: 2 },
        ask: { ar: 'الصوت يزيد لما تدوس بنزين، ولا يطلع أول ما تشغلها وهي باردة؟', en: 'Does the noise get louder when you accelerate, or only on a cold start?' }
    },
    {
        id: 'idle', label: 'Unstable idle (RPM goes up and down)', ar: 'سلانسيه غير ثابت', urgency: 'drive',
        words: ['السلانسيه', 'سلانسيه', 'الدورات', 'الدوره', 'العداد ينزل', 'واقفه', 'rpm', 'idle', 'revs', 'standing still'],
        codes: { P0505: 5, P0506: 4, P0507: 4, P0171: 2 },
        ask: { ar: 'السلانسيه يزيد وينقص لما تشغل المكيف؟', en: 'Does the idle go up and down when you turn the AC on?' }
    }
];

const FAMILIES = {
    airFuel: {
        codes: ['P0171', 'P0172', 'P0101', 'P0133', 'P0087', 'P0230'],
        ar: 'خليط الهوا والبنزين مو مضبوط، يعني المكينة تاخذ هوا زيادة أو بنزين ناقص (أو العكس).',
        en: 'the air and fuel mix is off, the engine is getting too much air or too little fuel (or the reverse).',
        checkAr: 'ابدأ بالأرخص: نظّف حساس الهوا (MAF)، وشيك على تهريب هوا في الليات، وبعدين فلتر البنزين وطرمبة البنزين.',
        checkEn: 'Start with the cheapest: clean the air flow sensor (MAF), check for vacuum leaks in the hoses, then the fuel filter and fuel pump.'
    },
    ignition: {
        codes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0325'],
        ar: 'في سلندر أو أكثر ما يحترق صح (Misfire)، وهذا يسبب الرجفة.',
        en: 'one or more cylinders are not firing properly (misfire), which causes the shaking.',
        checkAr: 'ابدأ بالأرخص: البواجي (الشمعات)، بعدين الكويلات، بعدين البخاخات.',
        checkEn: 'Start with the cheapest: spark plugs, then ignition coils, then fuel injectors.'
    },
    idle: {
        codes: ['P0505', 'P0506', 'P0507', 'P0122', 'P0121'],
        ar: 'نظام التحكم بالسلانسيه أو بوابة الهوا (Throttle) ما يضبط الدورات وهي واقفة.',
        en: 'the idle control or throttle is not holding the RPM steady at idle.',
        checkAr: 'ابدأ بالأرخص: نظّف بوابة الهوا (الثروتل) وصمام السلانسيه، وشيك على حساس الثروتل.',
        checkEn: 'Start with the cheapest: clean the throttle body and idle valve, then check the throttle sensor.'
    },
    sensors: {
        codes: ['P0335', 'P0340', 'P0011', 'P0016'],
        ar: 'الكمبيوتر ما يقرأ مكان الكرنك أو الكامات صح، فيتلخبط توقيت الاشتعال.',
        en: 'the computer is not reading the crankshaft or camshaft position correctly, so ignition timing goes wrong.',
        checkAr: 'شيك على حساس الكرنك والكامات وأسلاكهم، وبعدين زيت المكينة (مستواه ونظافته) لأنه يأثر على التوقيت.',
        checkEn: 'Check the crank and cam sensors and their wiring, then the engine oil level and condition, which affects timing.'
    },
    exhaust: {
        codes: ['P0420', 'P0442', 'P0455', 'P0299'],
        ar: 'المشكلة في الشكمان أو الدبة (الكتلايزر) أو نظام أبخرة البنزين.',
        en: 'the problem is in the exhaust, the catalytic converter, or the fuel vapor system.',
        checkAr: 'ابدأ بالأرخص: تأكد إن غطا البنزين مسكّر زين، بعدين حساسات الأكسجين، وآخر شي الدبة لأنها غالية.',
        checkEn: 'Start with the cheapest: make sure the fuel cap is tight, then the oxygen sensors, and the catalytic converter last because it is expensive.'
    },
    cooling: {
        codes: ['P0217', 'P0128', 'P0117', 'P0118', 'P0480'],
        ar: 'نظام التبريد مو قاعد يبرد المكينة صح.',
        en: 'the cooling system is not keeping the engine cool.',
        checkAr: 'وقّف السيارة وخلها تبرد. شيك على مستوى الماي، ومروحة الرديتر، والثرموستات.',
        checkEn: 'Stop and let it cool down. Check the coolant level, the radiator fan, and the thermostat.'
    },
    transmission: {
        codes: ['P0700', 'P0730', 'P0715', 'P0740', 'P0750'],
        ar: 'كمبيوتر القير لقى مشكلة في التبديل أو في حساسات القير.',
        en: 'the gearbox computer found a problem with shifting or its sensors.',
        checkAr: 'ابدأ بالأرخص: شيك على مستوى زيت القير ولونه (إذا محروق أو أسود بدله)، بعدين حساسات السرعة.',
        checkEn: 'Start with the cheapest: check the gearbox oil level and color (replace it if it is dark or burnt), then the speed sensors.'
    },
    electrical: {
        codes: ['P0562', 'P0563', 'P0620', 'P0622'],
        ar: 'الكهرباء في السيارة مو ثابتة، غالبًا من البطارية أو الدينمو.',
        en: 'the car\'s voltage is not stable, usually from the battery or the alternator.',
        checkAr: 'ابدأ بالأرخص: نظّف أقطاب البطارية وافحصها، بعدين افحص شحن الدينمو.',
        checkEn: 'Start with the cheapest: clean and test the battery terminals, then test the alternator charging.'
    }
};

const URGENCY_ORDER = ['stop', 'soon', 'unknown', 'drive'];

const URGENCY_TEXT = {
    stop: { ar: '⚠️ لا تسوق السيارة لين تنفحص، ممكن تسبب ضرر أكبر أو خطر عليك.', en: '⚠️ Do not drive until it is checked, it can cause more damage or put you at risk.' },
    soon: { ar: 'تقدر تسوقها مسافات قصيرة، بس ودها الورشة قريب.', en: 'You can drive short distances, but take it to a workshop soon.' },
    drive: { ar: 'مو خطيرة الحين، بس لا تطنشها.', en: 'Not dangerous right now, but do not ignore it.' },
    unknown: { ar: 'خلها تنفحص بجهاز OBD عشان نعرف بالضبط.', en: 'Have it scanned with an OBD reader to know for sure.' }
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

const isArabic = (text) => /[؀-ۿ]/.test(String(text || ''));

const familyOf = (code) => Object.values(FAMILIES).find((f) => f.codes.includes(code)) || null;

const think = (messages) => {
    const inputs = [].concat(messages).map(normalize);
    const matched = [];
    const scores = {};

    PREPARED.forEach((symptom) => {
        const at = inputs.map((input) => symptom.matchers.some((match) => match(input)));
        if (!at.includes(true)) return;
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

const reply = ({ lang, symptoms, top, urgency, carName, asked = [] }) => {
    const ar = lang === 'ar';
    const lines = [];

    if (symptoms.length) {
        const list = symptoms.map((s) => (ar ? s.ar : s.label.toLowerCase())).join(ar ? '، و' : ', ');
        lines.push(ar
            ? `فهمت إن ${carName ? `الـ ${carName} حقتك فيها` : 'سيارتك فيها'}: ${list}.`
            : `So your ${carName || 'car'} has: ${list}.`);
    }

    if (top) {
        const family = familyOf(top.code);
        const pct = top.confidence ? (ar ? ` (${top.confidence}%)` : ` (${top.confidence}%)`) : '';
        if (family) {
            lines.push(ar
                ? `${symptoms.length > 1 ? 'لما تجتمع هالأعراض مع بعض، ' : ''}غالبًا ${family.ar} أقرب احتمال هو ${top.code}${pct}: ${top.name}.`
                : `${symptoms.length > 1 ? 'Put together, ' : ''}most likely ${family.en} The closest match is ${top.code}${pct}: ${top.name}.`);
            lines.push(ar ? family.checkAr : family.checkEn);
        } else {
            lines.push(ar
                ? `أقرب احتمال هو ${top.code}${pct}: ${top.name}.`
                : `The closest match is ${top.code}${pct}: ${top.name}.`);
        }
        if (top.hadBefore) {
            lines.push(ar
                ? 'وانتبه: هالكود طلع في سيارتك قبل، يعني يمكن التصليح الأول ما حل السبب.'
                : 'Note: this code showed up on your car before, so the last repair may not have fixed the cause.');
        }
        if (top.seen) {
            lines.push(ar
                ? `${top.seen} ${top.seen === 1 ? 'سائق' : 'سواق'} ثانيين سجلوا نفس الكود.`
                : `${top.seen} other driver${top.seen === 1 ? '' : 's'} logged the same code.`);
        }
    }

    if (urgency) lines.push(ar ? URGENCY_TEXT[urgency].ar : URGENCY_TEXT[urgency].en);

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
    }
].map((p) => ({ ...p, matchers: p.words.map(toMatcher) }));

const findPart = (text) => {
    const input = normalize(text);
    return PARTS.find((p) => p.matchers.some((match) => match(input))) || null;
};

const partReply = (part, lang) => {
    const ar = lang === 'ar';
    return ar
        ? `${part.ar}: ${part.whereAr} شغلته: ${part.jobAr} الأكواد المرتبطة فيه: ${part.codes.join('، ')}.`
        : `${part.en}: ${part.whereEn} What it does: ${part.jobEn} Related codes: ${part.codes.join(', ')}.`;
};

module.exports = { think, reply, isArabic, familyOf, findPart, partReply, SYMPTOMS, URGENCY_ORDER };
