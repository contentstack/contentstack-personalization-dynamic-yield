var Contentstack = require('contentstack');
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join('..', 'config', env));

var Stack = Contentstack.Stack(config.contentstack.apiKey, config.contentstack.deliveryToken, env);

module.exports = Stack;
