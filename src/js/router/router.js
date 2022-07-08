/* View HBS */

import home from '../../hbs/home.hbs';
import editor from '../../hbs/editor.hbs';
import profile from '../../hbs/profile.hbs';
import message from '../../hbs/message.hbs';
import post from '../../hbs/post.hbs';
import postUpdate from '../../hbs/post_update.hbs';

/* JS */

export const router = {
    '/': home(),
    '/home': home(),
    '/message': message(),
    '/post': post(),
    '/editor': editor(),
    '/profile': profile(),
    '/postupdate': postUpdate()
};