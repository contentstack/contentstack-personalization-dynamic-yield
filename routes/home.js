const express = require('express');
const router = express.Router();
const DYAPI = require('./../DYAPI');
const selector = ["<<API Campaign Selector>>"];  // Add the API Campaign Selector


router.get('/', async (req, res, next) => {
  const { heroBanner } = await getPageContent(req);

  res.render('home.html', {
    banner: heroBanner
  });
})

async function getPageContent(req) {
  // Complete the context with the appropriate page type, and call the API
  req.dyContext.page.type = 'HOMEPAGE';

  const apiResponse = await DYAPI.choose(req.userId, req.sessionId, req.dyContext,
    selector);

  const content = {
    heroBanner: apiResponse[selector]
  };

  return content;
}

module.exports = router;
