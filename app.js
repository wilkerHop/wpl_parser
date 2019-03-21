const convert = require('xml-js');
const fs = require('fs');

const WPLsPath = './WPLs';
const JSONsPath = './JSONs'

const getWPLs = async () => await fs.readdirSync(WPLsPath);
getWPLs().then(r => console.log(r));

const readWPLs = async file => JSON.parse(convert.xml2json(await fs.readFileSync(`${WPLsPath}/${file}`, 'utf8'), {
  compact: true,
}), );

const formatFileName = name => name.split(/[\\\\/:*?\"<>|]/).join('-')

const writeJSON = async obj => fs.writeFileSync(`${JSONsPath}/${formatFileName(obj.title || obj.smil.head.title._text+ '.raw')}.json`, JSON.stringify(obj));

const createPlaylistObj = wpl => {
  return {
    title: wpl.smil.head.title._text,
    tracks_files: wpl.smil.body.seq.media.map(e =>
      e._attributes.src.split(/\\|\//).pop(),
    ),
  };
};

(async () =>
  (await getWPLs()).forEach(async file => {
    const raw = await readWPLs(file);
    
    if (file == 'DubsTroniks.wpl')
      console.log(createPlaylistObj(raw))

    Promise.all([writeJSON(raw), writeJSON(createPlaylistObj(raw))]);
  }))
();