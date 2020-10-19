module.exports = (app) => {
  app.use('/', require('../middlewares'));
  app.use('/', require('./home'));
}
