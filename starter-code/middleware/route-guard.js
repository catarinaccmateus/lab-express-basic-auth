'use strict';

module.exports = (req,res,next) => {
    if(req.user) {
        next();
    } else {
        next(new Error('If you are not logged in, you cant see this page!'));
    }
};

