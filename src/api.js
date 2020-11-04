import { BASE_URL } from './_vars';
import { userLoginExpired, refreshUser } from './auth';

export const API_URL = `https://${BASE_URL}/api/v0`;
const API_URL_NOSSL = `http://${BASE_URL}/api/v0`;

export function stripUrl(url) {
    return url.replace(API_URL, '').replace(API_URL_NOSSL, '');
}

export function relativePath(url) {
    return '/score' + stripUrl(url)
}

export async function fetchJson(path, contents) {
    let res = await fetch(path, contents);
    return res.json();
}

export async function fetchAsUser(authContext, path, contents) {
    let user = authContext.user;
    if (user != null) {
        if (userLoginExpired(authContext))
            await refreshUser(authContext);

        if (!('headers' in contents))
            contents.headers = {};
        contents.headers['Authorization'] = `Bearer ${user.auth.access}`;
    }
    return fetch(path, contents);
}

export async function getSongs() {
    let res = await fetch(`${API_URL}/song`);
    return res.json().catch(console.err);
}

export async function getSong(songId) {
    let res = await fetch(`${API_URL}/song/${songId}`);
    return res.json();
}

export async function getChart(chartId) {
    let res = await fetch(`${API_URL}/chart/${chartId}`);
    return res.json();
}

export async function getScore(scoreId) {
    let res = await fetch(`${API_URL}/score/${scoreId}`);
    let score = await res.json();
    // TODO Populate this server-side.
    let player = await fetch(`${API_URL}/user/${score.player}`);
    score.player = await player.json();
    return score;
}

/** `submission` should contain `chart` and `song` fields. */
export async function submitChart(authContext, submission) {
    let res = await fetchAsUser(authContext, `${API_URL}/chart/with_song/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(submission)
    });
    return res.json();
}

export async function submitChartContents(authContext, fileName, fileContents) {
    let res = await fetchAsUser(authContext, `${API_URL}/chart/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: fileName,
            contents: fileContents
        })
    });
    return res;
}
