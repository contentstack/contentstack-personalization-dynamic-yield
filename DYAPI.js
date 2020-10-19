const request = require('request-promise-native');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/' + env);

// DY's choose API call 
async function choose(userId, sessionId, dyContext, selectors = []) {

  const options = {
    method: 'POST',
    uri: `${config.dy.host}/v2/serve/user/choose`,
    headers: {
      'DY-API-Key': config.dy.apiKey,
    },
    body: {
      selector: {
        names: selectors,
      },
      context: dyContext,
    },
    json: true,
  };

  let variations = {};
  try {
    const response = await request(options);
    variations = response.choices.reduce(flattenCampaignData, {});
  } catch (e) {
    console.error(`ERROR IN CHOOSE: ${e.message}`);
  }
  return variations;
}

function flattenCampaignData(res, choice) {
  res[choice.name] = { decisionId: choice.decisionId, ...choice.variations[0].payload.data };
  return res;
}

module.exports = {
  choose
};
