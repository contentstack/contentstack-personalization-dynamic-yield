var Contentstack = require('contentstack');

var Stack = Contentstack.Stack(process.env.CONTENTSTACK_API_KEY, process.env.CONTENTSTACK_DELIVERY_TOKEN, process.env.CONTENTSTACK_PUBLISH_ENVIRONMENT);

module.exports = Stack;
