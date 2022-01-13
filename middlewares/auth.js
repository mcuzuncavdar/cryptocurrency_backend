module.exports = async (req, res, next) => {
    try {
        if (req.session.loggedIn) {
            next();
        } else {
            return res.redirect('/auth/login');
        }

    } catch (err) {
        return res.redirect('/auth/login');
    }

}
