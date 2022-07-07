/* View HBS */

import home from '../../hbs/home.hbs';
import editor from '../../hbs/editor.hbs';

/* JS */

export const router = {
    '/': home(),
    '/home': home(),
    '/editor': editor()
};