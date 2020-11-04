import React from 'react';

import { relativePath } from './api';

export const TrailItem = {
    home: function() { return { name: 'Home', href: '/score'}; },
    song: function(maybeSong) {
        return {
            name: maybeSong == null ? null : maybeSong.title,
            href: maybeSong == null ? '' : relativePath(maybeSong.url)
        };
    },
    chart: function(maybeChart) {
        return {
            name: maybeChart ? `${maybeChart.difficulty_shortname} ${maybeChart.difficulty_index}` : null,
            href: maybeChart == null ? '' : relativePath(maybeChart.url)
        };
    }
}

export const TrailContext = React.createContext({
    entries: [],
    set: (entries) => {}
});
