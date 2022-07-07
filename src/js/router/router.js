/* View HBS */

import home from '../../hbs/home.hbs';
import editor from '../../hbs/editor.hbs';
import profile from '../../hbs/profile.hbs';
import message from '../../hbs/message.hbs';

/* JS */

export const router = {
    '/': home(),
    '/home': home(),
    '/editor': editor(),
    '/profile': profile(),
    '/message': message()
};