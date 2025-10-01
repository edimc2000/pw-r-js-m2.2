import { test, expect } from '@playwright/test'
import { defineConfig, devices } from '@playwright/test';




const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = '12048004222'
const base64Credentials = btoa(`${accountSid}:${authToken}`)



function buildPayload(sendingNumber: string, message: string) {
  return {
    ToCountry: 'CA',
    ToState: 'MB',
    SmsMessageSid: 'SM0e4029a2f9adc462165ea4d740894028',
    NumMedia: '0',
    ToCity: 'WINNIPEG',
    FromZip: '',
    SmsSid: 'SM0e4029a2f9adc462165ea4d740894028',
    FromState: 'MB',
    SmsStatus: 'received',
    FromCity: 'WINNIPEG',
    Body: message, // Your test message
    FromCountry: 'CA',
    To: '+12048004222',
    ToZip: '',
    NumSegments: '1',
    MessageSid: 'PWSM0e4029a2f9adc462165ea4d740894028',
    AccountSid: 'PWAC32307d5ff1f312ac476550f59e8c09c7',
    From: sendingNumber, // Test phone number
    ApiVersion: '2010-04-10'
  };
}

async function sendSMSTwilio(sendTo: string, sendFrom: string) {

  const formData = new URLSearchParams();
  formData.append('To', sendTo);// tere
  formData.append('From', sendFrom);
  formData.append('Body', `Daily Check-in Reminder\n\nDon''t break the chain!\nReply YES to complete your daily check-in.`);

  console.log(formData)
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    }
  );
  console.log('*****')
  const data = await response.json();
  console.log(await data)

}


test('TWILIO SEND MESSAGES', async ({ request }) => {
  const sendToPhoneNumbers = ['14319971987', '12049981480', '12049981157']
  for (let index = 0; index < sendToPhoneNumbers.length; index++) {
   await sendSMSTwilio(sendToPhoneNumbers[index], twilioPhoneNumber)
  }
})



test('API getUsersList', async ({ request }) => {
  const getUsersList = await request.get(`http://127.0.0.1:8080/api/account/locationgroup/1`,
    {
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer b2b30c9695d885f4e8a777bc6e07ff079952706d187b00ff12557da42e47ff8b`
      }
    }
  )

  expect(getUsersList.status()).toEqual(200)
  // debugging
  console.log(getUsersList.status())
  console.log((await getUsersList.json()).length)
  console.log(await getUsersList.json())
  console.log((await getUsersList.json())[0])
})

test('API last check in ', async ({ request }) => {
  let date = '2025-09-30'
  let subaccount = 7

  let apiEndpoint = `http://24.76.120.179:8030/api/account/checkin/status/${subaccount}?date=${date}`
  let getCheckinDetails = await request.get(apiEndpoint)

  console.log(apiEndpoint)
  // expect(getCheckinDetails.status()).toEqual(200)


  console.log(getCheckinDetails.status())
  console.log((await getCheckinDetails.json()).length)
  console.log(await getCheckinDetails.json())


})


test('API update - checkin ', async ({ request }) => {
  test.setTimeout(1200000); // time out at 120 secs
  // update some subacounts 
  let date = '2025-09-27'
  let subaccounts = [11, 12, 13]
  for (let subaccount of subaccounts) {
    console.log(subaccount)
    let apiEndpoint = `https://mapleqa.com:8069/api/account/checkin/update/${subaccount}?date=${date}`
    console.log(apiEndpoint)
    const getCheckinDetails = await request.get(apiEndpoint)
    // expect(getCheckinDetails.status()).toEqual(200)
    console.log(getCheckinDetails.status())
  }


})


test.skip('API update - sms ', async ({ request }) => {

  let apiEndpoint = 'https://mapleqa.com/api/account/checkin/sms'

  const payload = {
    "subaccount": "12",
    "date": "2025-09-20",
    "phoneNumber": "2049981157",
    "message": "playwright test message",
    "message2": "playwright test message"
  };

  const response = await request.post(apiEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token' // if needed
    },
    data: payload
  });

})

test('API TEST - CHECKIN/UPDATE - Twilio SMS webhook test valid and invalid number', async ({ request }) => {
  // Twilio-like form data payload
  let message = `PW Daily Check-in Reminder\n\nDon''t break the chain!\nReply YES to complete your daily check-in. ${Math.floor(Math.random() * (1000 - 1))} `
  let sendingNumber = ['+12049981157', '+12049981480', '+12049981158']; // Your test phone number

  // Expected XML response
  const expectedResponse = [
    `<Response></Response>`,
    `<Response></Response>`,
    "{\"success\":false,\"message\":\"Number not found\"}"
  ];

  for (let i = 0; i < sendingNumber.length; i++) {
    const formData = buildPayload(sendingNumber[i], message);
    // Convert to URLSearchParams for application/x-www-form-urlencoded content type
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
      params.append(key, value);
    }

    // Send POST request to your endpoint
    const response = await request.post('https://mapleqa.com:8069/api/account/checkin/sms', {
      // const response = await request.post('https://mapleqa.com/api/account/checkin/sms', { 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-twilio-signature': 'oQ/MpmBxp7nNSyCQ0hjprQbxJG4=',
      },
      data: params.toString()
    });

    const responseText = await response.text();
    // console.log('Response:', responseText);
    // console.log('WHOLE RESPONSE:', response);

    expect(responseText).toContain(expectedResponse[i]);
  }
});


function buildWhatAppPayload() {
  return {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "1300079507987806",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15551854200",
                "phone_number_id": "789323877597697"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "Kin Connect"
                  },
                  "wa_id": "14313733703"
                }
              ],
              "messages": [
                {
                  "from": "12049981157",
                  "id": "wamid.HBgLMTQzMTM3MzM3MDMVAgASGBQyQTVDREIzOTVFMzNBREYzMjMwNQA=",
                  "timestamp": "1758852960",
                  "text": {
                    "body": "(D100) PW Daily Check-in Reminder\n\nDon''t break the chain!\nReply YES to complete your daily check-in."
                  },
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  }

}



test('API TEST - CHECKIN/UPDATE - whatsapp', async ({ request }) => {


  const formData = buildWhatAppPayload();

  const response = await request.post('https://graph.facebook.com/v22.0/789323877597697/messages', {
    headers: {
      'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
      'content-type': 'application/json',
      'x-twilio-signature': 'oQ/MpmBxp7nNSyCQ0hjprQbxJG4=',
    },
    data: formData
  });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})




test('API TESTs - CHECKIN/UPDATE - whatsapp', async ({ request }) => {


  const formData = buildWhatAppPayload();

  let response = await request.post('https://mapleqa.com:8069/api/account/checkin/whatsapp', {
    headers: {
      'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
      'content-type': 'application/json',

    },
    data: formData
  });

  console.log(response.status())
  let responseText = await response.text();
  console.log(responseText)

  response = await request.get('https://mapleqa.com:8069/api/account/checkin/whatsapp', {
    headers: {
      'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
      'content-type': 'application/json',

    },
    data: formData
  });

  console.log(response.status())
  responseText = await response.text();
  console.log(responseText)

})



test('API TESTs - get test live ', async ({ request }) => {


  const response = await request.get('https://mapleqa.com:8069/api/test', {
    headers: {
      'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
      'content-type': 'application/json',

    },
  });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})


function buildWhatAppPayloadSendingLive(receivingWaNumber: string) {

  return {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": receivingWaNumber,
    "type": "text",
    "text": {

      "body": `PW Daily Check-in Reminder\n\n\n*Hello*,\nDon't break the chain! \n\nReply YES to complete your daily check-in.`
    }

  }
}


test('API TESTs - send a message whatsapp  ', async ({ request }) => {

  // let sendToQANumbers = ['14313733703'];
  let sendToQANumbers = ['12049981157', '14313733703', '639173029974'];
  // let sendToQANumbers = [ '639173029974']; //camille

  for (const sendToQANumber of sendToQANumbers) {

    const formData = buildWhatAppPayloadSendingLive(sendToQANumber);

    let WA_NUMBER = '791348680734564' // this is 639993564007
    let WA_NUMBER2 = '789323877597697' // this is 1 555 185 4200

    const response = await request.post(`https://graph.facebook.com/v22.0/${WA_NUMBER2}/messages`, {
      headers: {
        'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
        'content-type': 'application/json',
        'x-twilio-signature': 'oQ/MpmBxp7nNSyCQ0hjprQbxJG4=',
      },

      data: formData
    });

    console.log(response.status())
    const responseText = await response.text();
    console.log(responseText)
  }

})



test('API WHATSAPP VERIT  -  ', async ({ request }) => {



  let WA_NUMBER = '791348680734564' // this is 639993564007
  let WA_NUMBER2 = '789323877597697' // this is 1 555 185 4200
  const response = await request.post(`https://graph.facebook.com/v23.0/1300079507987806/phone_numbers?access_token=${process.env.W_ACCESS_TOKEN}`,
    {
      headers: {
        // 'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
        'content-type': 'application/json',
        // 'x-twilio-signature': 'oQ/MpmBxp7nNSyCQ0hjprQbxJG4=',
      },


    });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})





test('SMSMOBILESMS - Send test  ', async ({ request }) => {



  let apiKey = process.env.SMSMOBILEAPI_KEY
  let sendNumber = '+14313733703'
  let message = 'random X' + Math.floor(Math.random() * (1000 - 1 + 1)) + 1
  console.log(apiKey)
  const response = await request.post(` https://api.smsmobileapi.com/sendsms?apikey=${apiKey}&recipients=${sendNumber}&message=${message}`,
    {
      headers: {
        // 'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
        'content-type': 'application/json',
        // 'x-twilio-signature': 'oQ/MpmBxp7nNSyCQ0hjprQbxJG4=',
      },


    });

  console.log("STATUS: => ", response.status())
  const responseText = await response.text();
  console.log("RESPONSE TEXT: => ", responseText)
})




test('SMSMOBILESMS - api test  ', async ({ request }) => {

  const response = await request.post('https://mapleqa.com:8069/api/smsmobileapi/g', {
    headers: {

    },
    data: { "lih": "456" }
  });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})





test('SMSMOBILESMS - activate receive whatsapp   ', async ({ request }) => {
  let apiKey = process.env.SMSMOBILEAPI_KEY
  const response = await request.get(`https://api.smsmobileapi.com/getwa/active/?apikey=${apiKey}&statut=1`, {
    headers: {
      'content-type': 'application/json',
    },
    data: { "lih": "456" }
  });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})




test('SMSMOBILESMS - sync whatsapp   ', async ({ request }) => {
  let apiKey = process.env.SMSMOBILEAPI_KEY
  const response = await request.get(`https://api.smsmobileapi.com/getwa/synchronisation/?apikey=${apiKey}`, {
    headers: {
      'content-type': 'application/json',
    },
    data: { "lih": "456" }
  });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})



test('SMSMOBILESMS - retrieve whatsapp   ', async ({ request }) => {
  let apiKey = process.env.SMSMOBILEAPI_KEY
  const response = await request.get(`https://api.smsmobileapi.com/getwa/?apikey=${apiKey}`,
    {
      headers: {
        'content-type': 'application/json',
      },
      data: { "lih": "456" }
    });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})


