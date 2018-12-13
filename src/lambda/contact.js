export function handler(event, context, callback) {
  console.log(event.body.email);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ msg: "Contact Form!" })
  });
}
