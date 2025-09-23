import { test, expect } from '@playwright/test'

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
    let date = '2025-09-10'
    let subaccounts = [1, 2, 3, 6, 9, 10, 28, 15, 16, 17, 18, 19, 20, 11]
    for (let subaccount of subaccounts) {
        console.log(subaccount)
        // let apiEndpoint = `http://127.0.0.1:8080/api/account/checkin/update/${subaccount}?date=${date}`
        // let apiEndpoint = `http://24.76.120.179:8080/api/account/checkin/update/${subaccount}?date=${date}`
        let apiEndpoint = `http://10.0.0.200:8080/api/account/checkin/update/${subaccount}?date=${date}`
        console.log(apiEndpoint)
        const getCheckinDetails = await request.get(apiEndpoint)
        // expect(getCheckinDetails.status()).toEqual(200)
        console.log(getCheckinDetails.status())
    }

    // console.log(subaccount)
    // let apiEndpoint = `http://127.0.0.1:8080/api/account/checkin/update/${subaccount}?date=${date}`
    // console.log(apiEndpoint)
    // const getCheckinDetails = await request.get(apiEndpoint)
    // // expect(getCheckinDetails.status()).toEqual(200)
    // console.log(getCheckinDetails.status())
    // // console.log((await getCheckinDetails.json()).length)
    // console.log(await getCheckinDetails.json())  

    //     console.log(apiEndpoint)
    //     const getCheckinDetails = await request.get(apiEndpoint)
    //     // expect(getCheckinDetails.status()).toEqual(200)
    //     console.log(getCheckinDetails.status())
    //     // console.log((await getCheckinDetails.json()).length)
    //     // console.log(await getCheckinDetails.json())    
    // }


})




test('API update - sms ', async ({ request }) => {

    let apiEndpoint = 'http://mapleqa.com:8030/api/account/checkin/sms'

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

test('mimic Twilio SMS webhook', async ({ request }) => {
  // Twilio-like form data payload
  const formData = {
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
    Body: 'R929', // Your test message
    FromCountry: 'CA',
    To: '+12048004222',
    ToZip: '',
    NumSegments: '1',
    MessageSid: 'PWSM0e4029a2f9adc462165ea4d740894028',
    AccountSid: 'PWAC32307d5ff1f312ac476550f59e8c09c7',
    From: '+12049981157', // Test phone number
    ApiVersion: '2010-04-10'
  };

  // Convert to URLSearchParams for application/x-www-form-urlencoded content type
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(formData)) {
    params.append(key, value);
  }

  // Send POST request to your endpoint
  const response = await request.post('http://mapleqa.com:8030/api/account/checkin/sms', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: params.toString()
  });

  // Verify response
  expect(response.status()).toBe(200);
  
  const responseText = await response.text();
  console.log('Response:', responseText);
  
  // Verify the response contains expected XML
  expect(responseText).toContain('<Response>');
  expect(responseText).toContain('<Message>');
  expect(responseText).toContain('+12049981157'); // Should contain the from number
});