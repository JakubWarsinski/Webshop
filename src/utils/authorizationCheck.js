exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  req.session.returnTo = req.originalUrl;
  
  res.redirect('/auth/login');
};

exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  res.redirect('/user/dashboard');
};