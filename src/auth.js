import React from 'react';

import { API_URL } from './api';

const TOKEN_REFRESH_MS = 1000 * 60 * 5;

function loadUser(authContext) {
    const storageUser = localStorage.getItem('user');
    if (storageUser == null)
        return null;
    authContext.user = JSON.parse(storageUser);
    return authContext.user;
}

function saveUser(authContext) {
    if (!authContext.user)
        throw new Error('cannot save null user object');
    localStorage.setItem('user', JSON.stringify(authContext.user));
}

export async function getUser(authContext) {
    if (authContext.user && userLoginExpired(authContext)) {
        await refreshUser(authContext);
        // TODO Handle refresh token expired
    }
    return authContext.user ? authContext.user : loadUser(authContext);
}

export function userLoginExpired(authContext) {
    return Date.now() - authContext.user.authorizedAt > TOKEN_REFRESH_MS;
}

export async function signInUser(authContext, username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    const authResult = await res.json();
    authContext.user = {
        username: username,
        authorizedAt: Date.now(),
        auth: authResult
    }
    saveUser(authContext);
}

export async function refreshUser(authContext) {
    if (authContext.user == null)
        throw new Error('cannot refresh without already being logged in');

    let newToken = await (await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: authContext.user.auth.refresh })
    })).json();

    authContext.user.auth.access = newToken.access;
    authContext.user.authorizedAt = Date.now();

    saveUser(authContext);
}

export const AuthContext = React.createContext({
    user: null,
    set: (user) => {}
});
