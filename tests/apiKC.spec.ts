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
    let getCheckinDetails = await request.get(`http://127.0.0.1:8080/api/account/checkin/1`)

    expect(getCheckinDetails.status()).toEqual(200)

    console.log(getCheckinDetails.status())
    console.log((await getCheckinDetails.json()).length)
    console.log(await getCheckinDetails.json())



    // with query param - date 
     getCheckinDetails = await request.get(`http://127.0.0.1:8080/api/account/checkin/1?date=2025-09-21`)

    expect(getCheckinDetails.status()).toEqual(200)

    console.log(getCheckinDetails.status())
    console.log((await getCheckinDetails.json()).length)
    console.log(await getCheckinDetails.json())

})