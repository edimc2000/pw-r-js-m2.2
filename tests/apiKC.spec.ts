import { test, expect } from '@playwright/test'


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
  let date = '2025-09-23'
  let subaccounts = [11, 12, 13]
  for (let subaccount of subaccounts) {
    console.log(subaccount)
    let apiEndpoint = `http://mapleqa.com:8030/api/account/checkin/update/${subaccount}?date=${date}`
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
  let message = 'Test: Playwright ' + Math.floor(Math.random() * (1000 - 1)); // Your test message
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
    const response = await request.post('http://mapleqa.com:8030/api/account/checkin/sms', { 
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
    "messaging_product": "whatsapp",
    "to": "639993564007",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": { "code": "en_US" }
    }
   
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

  const response = await request.post('https://mapleqa.com/api/account/checkin/whatsapp', {
    headers: {
      'Authorization': `Bearer ${process.env.W_ACCESS_TOKEN}`,
      'content-type': 'application/json',
      
    },
    data: formData
  });

  console.log(response.status())
  const responseText = await response.text();
  console.log(responseText)
})