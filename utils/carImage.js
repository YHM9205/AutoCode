const WIKI = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

const titleCase = (text) => text.replace(/\b\w/g, (c) => c.toUpperCase());

const lookup = async (title) => {
    try {
        const res = await fetch(WIKI + encodeURIComponent(title.replace(/\s+/g, '_')), {
            headers: { 'User-Agent': 'AutoCode/1.0' },
            signal: AbortSignal.timeout(4000)
        });
        if (!res.ok) return '';
        const data = await res.json();
        if (data.type !== 'standard' || !data.thumbnail) return '';
        return data.thumbnail.source.split('?')[0];
    } catch (error) {
        return '';
    }
};

const findCarImage = async (make, model) => {
    if (!make || !model || make === 'Other') return '';
    const name = `${make.trim()} ${model.trim()}`;
    const tries = [...new Set([name, titleCase(name), `${titleCase(make.trim())} ${model.trim().toUpperCase()}`])];
    for (const title of tries) {
        const image = await lookup(title);
        if (image) return image;
    }
    return '';
};

module.exports = { findCarImage };
