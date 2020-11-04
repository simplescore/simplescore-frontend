import { sha3_512 } from 'js-sha3';

const DIFFICULTIES = {
    'nov': 'novice',
    'adv': 'advanced',
    'exh': 'exhaust',
    'mxm': 'maximum',
    'inf': 'infinite',
    'grv': 'gravity',
    'hvn': 'heavenly',
    'vvd': 'vivid'
};

export async function readFileAsync(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject(new Error("unable to read file"));
        }
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.readAsText(file);
    });
}

export async function parseKshForRequest(kshFile) {
    const kshContents = await readFileAsync(kshFile);
    const kshFileName = kshFile.name;

    const songObject = {
        song_artist: null,
        song_title: null
    };
    const chartObject = { 
        sha3: null,
        charter: null,
        difficulty_index: null,
        difficulty_shortname: null,
        difficulty_name: null
    };

    const lines = kshContents.split('\n');
    for (const line of lines) {
        if (!line.includes('='))
            continue;

        const readProp = (keyName, obj, prop, mapping) => {
            if (line.startsWith(`${keyName}=`)) {
                obj[prop] = line.split('=')[1].trim();
                if (mapping != null)
                    obj[prop] = mapping(obj[prop]);
            }
        };

        readProp('artist', songObject, 'song_artist');
        readProp('title', songObject, 'song_title');
        readProp('effect', chartObject, 'charter');
        readProp('level', chartObject, 'difficulty_index', val => Number.parseInt(val));
        readProp('difficulty', chartObject, 'difficulty_name');
    }

    // Check for a three-letter difficulty name at the end of the KSH filename.
    if (kshFileName.match(/^.*_[a-z]{3}\.ksh/) != null) {
        let diffTerm = kshFileName.replace(/^.*_([a-z]{3})\.ksh/, "$1");
        if (diffTerm in DIFFICULTIES) {
            chartObject['difficulty_shortname'] = diffTerm;
            chartObject['difficulty_name'] = DIFFICULTIES[diffTerm];
        }
    } else if (chartObject['difficulty_name'] != null) {
        // Find the matching shortname for the full difficulty name.
        for (const [k, v] of DIFFICULTIES.entries())
            if (chartObject['difficulty_name'] === v)
                chartObject['difficulty_shortname'] = k;
        // If not found, difficulty_shortname will remain null.
    } else
        throw new Error('unable to determine difficulty');

    // Calculate SHA3 for the chart.
    chartObject['sha3'] = sha3_512(kshContents);

    const checkObject = (obj) => {
        for (const prop in obj)
            if (obj[prop] == null)
                throw new Error(`object "${obj.constructor.name}" missing field "${prop}"`);
    };

    checkObject(songObject);
    checkObject(chartObject);

    return {
        song: songObject,
        chart: chartObject
    };
}
