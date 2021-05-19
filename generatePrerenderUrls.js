const fs = require('fs');

const urls = [{
    url: '/',
    title: 'Chord Scales'
}];

const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'Fs', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
for(const note of notes) {
    urls.push({
        url: `/scales/${note.toLowerCase()}`,
        title: `${note.replace('s', '♯').replace('b', '♭')} Scales`
    })
}

fs.writeFileSync('prerender-urls.json', JSON.stringify(urls, null, 4));
