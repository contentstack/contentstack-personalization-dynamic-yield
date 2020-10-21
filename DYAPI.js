const request = require('request-promise-native');

// DY's choose API call 
async function choose(userId, sessionId, dyContext, selectors = []) {

  const options = {
    method: 'POST',
    uri: `${process.env.DY_HOST}/v2/serve/user/choose`, 
    headers: {
      'DY-API-Key': process.env.DY_API_KEY
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
