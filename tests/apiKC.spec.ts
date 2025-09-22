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
    let date = '2025-09-22'
    let subaccount = 7
    let apiEndpoint =`http://127.0.0.1:8080/api/account/checkin/status/${subaccount}?date=${date}`

    const getCheckinDetails = await request.get(apiEndpoint)

    console.log(apiEndpoint)
    // expect(getCheckinDetails.status()).toEqual(200)
    

    console.log(getCheckinDetails.status())
    console.log((await getCheckinDetails.json()).length)
    console.log(await getCheckinDetails.json())


})


test('API update - checkin ', async ({ request }) => {
    let date = '2025-09-22'
    let subaccount = 7
    let apiEndpoint =`http://127.0.0.1:8080/api/account/checkin/update${subaccount}?date=${date}`

    const getCheckinDetails = await request.get(apiEndpoint)

    console.log(apiEndpoint)
    // expect(getCheckinDetails.status()).toEqual(200)
    

    console.log(getCheckinDetails.status())
    // console.log((await getCheckinDetails.json()).length)
    // console.log(await getCheckinDetails.json())


})