require("dotenv").config();
const mailgun = require("mailgun-js");
const apiKey = process.env.MAILGUN_API_KEY;
const apiUrl = process.env.DOMAIN;
const contactEmail = process.env.CONTACT_EMAIL;
const mg = mailgun({ apiKey, apiUrl });

const generateResponse = (body, statusCode) => {
  return {
    headers: {
      "access-control-allow-methods": "POST",
      "access-control-allow-origin": "*",
      "content-type": "application/json"
    },
    statusCode: statusCode,
    body: JSON.stringify(body)
  };
};

const sendEmail = data => {
  const { from, to, subject, text } = data;
  const email = { from, to, subject, text };

  return mg.messages().send(email);
};

exports.handler = async (event, context, callback) => {
  var response;

  // complain if method is not POST or event body is empty
  if (event.httpMethod !== "POST" || !event.body) {
    response = generateResponse({ status: "Invalid Request" }, 200);
    callback(null, response);
    return;
  }
  const { body } = event;
  const data = JSON.parse(body);

  //-- Make sure we have all required data. Otherwise, complain.
  if (
    !data.email ||
    !data.name ||
    !data.company ||
    !data.industry ||
    !data.problem
  ) {
    response = generateResponse({ status: "missing-information" }, 200);
    callback(null, response);
    return;
  }

  // build the email object
  const email = {
    from: data.email,
    to: contactEmail,
    subject: data.company + " (" + data.industry + ") - " + data.name,
    text: data.problem
  };

  // attempt to send email
  try {
    const result = await sendEmail(email);
    response = generateResponse({ result: result }, 200);
    callback(null, response);
    return;
  } catch {
    response = generateResponse({ status: "Error Sending Email" }, 200);
    callback(null, response);
    return;
  }
};
