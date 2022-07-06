/* View HBS */

import home from '../../hbs/home.hbs';
import message from '../../hbs/message.hbs';

/* JS */

export const router = {
    '/': home(),
    '/home': home(),
    '/message': message()
};