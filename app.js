const convert = require('xml-js');
const fs = require('fs');

(async () => {
    const xml = await fs.readFileSync('./Cleaning.wpl', 'utf8');
    const raw = JSON.parse(convert.xml2json(xml, {
        compact: true,
        spaces: 4
    }));

    const playlist = {
        title: raw.smil.head.title._text,
        tracks_files: raw.smil.body.seq.media.map(e => e._attributes.src.split(/\\|\//).pop()),
    }
    await fs.writeFileSync(playlist.title +'.json', JSON.stringify(playlist), {
        encoding: 'utf-8'
    })
})();