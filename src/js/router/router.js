/* View HBS */

import home from '../../hbs/home.hbs';
import editor from '../../hbs/editor.hbs';
import message from '../../hbs/message.hbs';
import post from '../../hbs/post.hbs';

/* JS */

export const router = {
    '/': home(),
    '/home': home(),
    '/message': message(),
    '/post': post()
    '/editor': editor(),
    '/message': message()

};