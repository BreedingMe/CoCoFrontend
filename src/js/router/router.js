/* View HBS */

import home from '../../hbs/home.hbs';
import editor from '../../hbs/editor.hbs';
// import comment from '../../hbs/commnet.hbs';
import profile from '../../hbs/profile.hbs';
import message from '../../hbs/message.hbs';
import post from '../../hbs/post.hbs';

/* JS */

export const router = {
    '/': home(),
    '/home': home(),
    '/message': message(),
    '/post': post(),
    '/editor': editor(),
    // '/comment': comment(),
    '/profile': profile()
};