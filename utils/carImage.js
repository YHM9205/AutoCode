const WIKI = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const HEADERS = { 'User-Agent': 'AutoCode/1.0 (https://github.com/YHM9205/AutoCode)' };

const titleCase = (text) => text.replace(/\b\w/g, (c) => c.toUpperCase());
const SKIP = /wagon|estate|kombi|hatch|tourer|touring|break|interior|engine|dashboard|cockpit|rear|heck|badge|logo|concept|race|rally|crash|police|taxi|wreck/i;
const oldYear = (title, year) => (title.match(/(19|20)\d{2}/g) || []).some((y) => Number(y) < year - 6);
const squash = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

const get = async (url) => {
    try {
        const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(4000) });
        if (res.status === 404) return {};
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
};

const fromCommons = async (make, model, year) => {
    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        generator: 'search',
        gsrnamespace: '6',
        gsrlimit: '10',
        gsrsearch: `${year} ${make} ${model}`,
        prop: 'imageinfo',
        iiprop: 'url',
        iiurlwidth: '640'
    });
    const data = await get(`${COMMONS}?${params}`);
    if (!data) return null;
    const pages = Object.values((data.query && data.query.pages) || {}).sort((a, b) => a.index - b.index);
    const match = pages.find((p) => {
        const title = squash(p.title);
        return /\.(jpe?g|png)$/i.test(p.title)
            && !SKIP.test(p.title)
            && !oldYear(p.title, year)
            && title.includes(String(year))
            && title.includes(squash(make))
            && title.includes(squash(model))
            && p.imageinfo;
    });
    return match ? match.imageinfo[0].thumburl.split('?')[0] : '';
};

const fromWikipedia = async (title) => {
    const data = await get(WIKI + encodeURIComponent(title.replace(/\s+/g, '_')));
    if (!data) return null;
    if (data.type !== 'standard' || !data.thumbnail) return '';
    return data.thumbnail.source.split('?')[0];
};

const findCarImage = async (make, model, year) => {
    if (!make || !model || make === 'Other') return '';
    make = make.trim();
    model = model.trim();
    let failed = false;
    const check = (image) => {
        if (image === null) failed = true;
        return image;
    };
    if (year) {
        const image = check(await fromCommons(make, model, year));
        if (image) return image;
    }
    const name = squash(model).startsWith(squash(make)) ? model : `${make} ${model}`;
    for (const title of new Set([name, titleCase(name), `${titleCase(make)} ${model.toUpperCase()}`])) {
        const image = check(await fromWikipedia(title));
        if (image) return image;
    }
    return failed ? undefined : '';
};

module.exports = { findCarImage };
