require("dotenv").config();
import querystring from "querystring";
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.DOMAIN;
const contactEmail = process.env.CONTACT_EMAIL;
const mailgun = require("mailgun-js")({ apiKey, domain });

const generateResponse = (body, statusCode) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body)
  };
};

exports.handler = function(event, context, callback) {
  if (event.httpMethod !== "POST") {
    // Only run on POST requests
    console.log("Bad method:", event.httpMethod);
    return callback(null, generateResponse("Method Not Allowed", 405));
  } else if (!event.body) {
    // complain if event body is empty
    console.log("Empty request body");
    return callback(null, generateResponse("Invalid Request", 204));
  }
  //-- Make sure we have all required data. Otherwise, complain.
  const data = JSON.parse(event.body);
  if (!data.name || !data.email || !data.needs) {
    console.log("Missing info");
    console.log(data);
    return callback(null, generateResponse("Missing Information", 204));
  }
  // build the email object from the request body
  const email = {
    from: data.email,
    to: contactEmail,
    subject: "Contact Form - " + data.name,
    html: `
      <h1>New Polytope Solutions Contact Form Entry</h1>
      <h2><b>Company:</b> ${data.company}</h2>
      <h3><b>Industry:</b>${data.industry}</h3>
      <h4><b>Name:</b>${data.name}</h4>
      <h4><b>Email:</b>${data.email}</h4>
      <p><b>Needs:</b>${data.needs}</p>
      `
  };
  // attempt to send email
  try {
    mailgun.messages().send(email, (error, body) => {
      let resp = generateResponse({ body }, 200);
      console.log("Email sent", email);
      return callback(null, resp);
    });
  } catch (error) {
    let resp = generateResponse("Server Error", 500);
    console.error(error);
    return callback(error, resp);
  }
};
