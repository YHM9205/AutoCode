require('dotenv').config();
const mongoose = require('mongoose');
const yaml = require('js-yaml');
const ObdCode = require('../models/ObdCode');

const BASE = 'https://raw.githubusercontent.com/foerbsnavi/OBDex/main/data/generic/';
const FILES = ['P0xxx', 'P2xxx', 'P3xxx', 'B0xxx', 'C0xxx', 'U0xxx', 'U3xxx'];

const STOP_WORDS = /overheat|over temperature|oil pressure|coolant temperature.*high|brake pressure|brake fluid/i;
const ORDER = { high: 0, medium: 1, low: 2 };

const getSeverity = (item) => {
    const title = item.title.en;
    const flags = item.flags || {};
    if (STOP_WORDS.test(title)) return 'stop';
    if (flags.limp_mode_possible || flags.mil) return 'soon';
    return 'drive';
};

const getSolution = (item) => {
    const causes = (item.common_causes || [])
        .sort((a, b) => ORDER[a.likelihood] - ORDER[b.likelihood])
        .map((c) => c.label.en);
    return causes.length ? 'Check: ' + causes.join(', ') : '';
};

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    let total = 0;

    for (const file of FILES) {
        const res = await fetch(`${BASE}${file}_enriched.yaml`);
        const items = yaml.load(await res.text());

        const ops = items.map((item) => ({
            updateOne: {
                filter: { code: item.code },
                update: {
                    $set: {
                        code: item.code,
                        name: item.title.en,
                        category: item.code[0],
                        problem: item.description.en,
                        solution: getSolution(item),
                        severity: getSeverity(item)
                    }
                },
                upsert: true
            }
        }));

        await ObdCode.bulkWrite(ops);
        total += ops.length;
        console.log(`${file}: ${ops.length} codes`);
    }

    console.log(`Done, ${total} codes imported`);
    await mongoose.disconnect();
})();
