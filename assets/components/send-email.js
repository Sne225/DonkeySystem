// send-email.js

import { Linking } from 'react-native';
import qs from 'qs';
import Email from 'react-native-email';

export async function sendEmail(to, subject, body, options = {}) {
  const { cc, bcc } = options;

  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc,
  });

  let url = `mailto:${to}`;

  if (query.length) {
    url += `?${query}`;
  }

  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Provided URL cannot be handled');
  }

  return Email.send({
    subject: subject,
    body: body,
    recipients: [to],
    cc: cc ? [cc] : undefined,
    bcc: bcc ? [bcc] : undefined,
  });
}

// Use the sendEmail function
sendEmail('protectorpeace@gmail.com', 'Greeting!', 'I think you are amazing!')
  .then(() => {
    console.log('Email sent successfully');
  })
  .catch((error) => {
    console.error('Failed to send email:', error);
  });
