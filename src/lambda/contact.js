require("dotenv").config();
const mailgun = require("mailgun-js");
const apiKey = process.env.MAILGUN_API_KEY;
const apiUrl = process.env.DOMAIN;
console.log(apiKey);
console.log(apiUrl);
const mg = mailgun({ apiKey, apiUrl });

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
  var response;

  if (event.httpMethod !== "POST" || !event.body) {
    response = generateResponse(
      JSON.stringify({ status: "Invalid Request" }),
      200
    );
    callback(null, response);
    return;
  }
  const { body } = event;
  const data = JSON.parse(body);

  //-- Make sure we have all required data. Otherwise, escape.
  if (!data.email || !data.name || !data.company || !data.problem) {
    response = generateResponse(
      JSON.stringify({ status: "missing-information" }),
      200
    );
    callback(null, response);
    return;
  }

  const email = {
    from: data.email,
    to: "contact@polytopesolutions.com",
    subject: data.company + " (" + data.industry + ") - " + data.name,
    text: data.problem
  };

  try {
    const result = await sendEmail(email);
  } catch {
    response = generateResponse(
      JSON.stringify({ status: "Error Sending Email" }),
      200
    );
    callback(null, response);
  }

  response = generateResponse(result, 200);
  callback(null, response);
};
