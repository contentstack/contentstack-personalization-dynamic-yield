const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const app = express();
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const responseTime = require('response-time');
const cookieSession = require('cookie-session');
const uuidv4 = require('uuid/v4');


app.use(responseTime({ header: 'x-runtime' }));

// setting view and nunjuks configuration
app.set('view engine', 'html');
nunjucks.configure('views', {
  watch: true,
  autoescape: false,
  express: app
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

// setting static files
app.use('/static', express.static(`${__dirname}/public`));

/* userId management */
app.use((req, res, next) => {
  let { userId } = req.cookies;
  if (!userId) {
    userId = uuidv4();
    res.cookie('userId', userId, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
  }
  req.userId = userId;
  next();
});

/* session management */
app.use(cookieSession({
  name: 'session',
  secret: 'somesecretkeyhash',
}));

app.use((req, _res, next) => {
  if (req.session.isNew) { // cookieSession defines what is considered a new session
    req.session.sessionId = uuidv4();
  }
  req.sessionId = req.session.sessionId;
  // for the sake of simplicity the cart is stored in the session as well
  req.cart = req.session.cart || { total: 0, products: [] };
  req.session.cart = req.cart;
  next();
});

/* add dyContext */
app.use((req, _res, next) => {
  req.dyContext = {
    page: {
      location: `${req.protocol}://${req.hostname}${req.originalUrl}`,
      data: [],
    }
  };

  next();
});

// require routes
require('./routes')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
