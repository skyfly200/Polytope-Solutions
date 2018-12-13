require("dotenv").config();
const mailgun = require("mailgun-js");
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.DOMAIN;
const mg = mailgun({ apiKey, domain });

const generateResponse = (body, statusCode) => {
  return {
    headers: {
      "access-control-allow-methods": "POST",
      "access-control-allow-origin": "*",
      "content-type": "application/json"
    },
    statusCode: statusCode,
    body: `{\"result\": ${body.message}}`
  };
};

const sendEmail = data => {
  const { from, to, subject, text } = data;
  const email = { from, to, subject, text };

  return mg.messages().send(email);
};

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== "POST" || !event.body) {
    callback(null, {
      statusCode,
      headers,
      body: ""
    });
  }

  const { body } = event;
  const data = JSON.parse(body);

  //-- Make sure we have all required data. Otherwise, escape.
  if (!data.email || !data.name || !data.company || !data.problem) {
    console.error("Required information is missing.");

    callback(null, {
      statusCode,
      headers,
      body: JSON.stringify({ status: "missing-information" })
    });

    return;
  }

  // try catch error handling
  const email = {
    from: data.email,
    to: "contact@polytopesolutions.com",
    subject: data.company + " (" + data.industry + ") - " + data.name,
    text: data.problem
  };
  const result = await sendEmail(email);
  const response = generateResponse(result, 200);

  callback(null, response);
};
