const { TOTP } = require("./TOTP.js");
const { Client } = require('discord.js-selfbot-v13');

/**
 * @param {Client} client
 * @returns {string}
*/
async function vanity_defender(client) {
    if (!client.db.mfa) return;

    let locks = client.guilds.cache.get("1344432523324952618");
    if (!locks) return;
    try {
        const getTicket = await fetch(`https://discord.com/api/v9/guilds/${locks.id}/vanity-url`, {
            method: "PATCH",
            headers: {
                Authorization: client.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: "le4ks" }),
        });

        const ticketResponse = await getTicket.json();

        if (ticketResponse.code !== 60003) return console.log("Failed to get ticket:", ticketResponse);
        const { otp } = await TOTP.generate(client.db.mfa);

        const requestMfa = await fetch("https://discord.com/api/v9/mfa/finish", {
            method: "POST",
            headers: {
                accept: "*/*",
                "accept-language": "en-US",
                "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-debug-options": "bugReporterEnabled",
                "x-discord-locale": "en-US",
                "x-discord-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                "x-super-properties": Buffer.from(JSON.stringify(client.options.ws.properties), "ascii").toString("base64"),
                referer: "https://discord.com/channels/@me",
                origin: "https://discord.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Electron/33.0.0 Safari/537.36",
                priority: "u=1, i",
                Authorization: client.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ticket: ticketResponse.mfa.ticket,
                data: ticketResponse.mfa.methods[0].type == 'totp' ? otp : client.db.mfa,
                mfa_type: ticketResponse.mfa.methods[0].type,
            }),
            redirect: "follow",
            credentials: "include",
        });

        const getMfa = await requestMfa.json();
        if (getMfa.token) {
            client.options.http.headers = { "cookie":  '__Secure-recent_mfa=' + getMfa.token + '; __dcfduid=763d7700cb9511efb74fff2bdf097cec; __sdcfduid=763d7701cb9511efb74fff2bdf097cecc235dc06a44f34d15887c89d3d7eb3c0754d589111ffe4a6739de20b5b3a8aec; __stripe_mid=22a47eff-0ca5-405f-8184-7d6af24b3df4ae69ff; _cfuvid=WqKeTvQpD.OO5RtMyD9EZ10kBYD2sC5DlZchYjpA4G8-1744398454941-0.0.1.1-604800000; locale=en-US; cf_clearance=.H.DzsYHG.W5TN_y0RtoK251wXj0tVujFAm3ykIfn7c-1744398463-1.2.1.1-lVtLYd2UxOE2Sd0kJAyEhdfPJhVq1FwMdfmzeJLZoF7l2nk_FOfv9kwOUSRvAzoZUovT1TBZw0TqPKvY5eOQycmfnYFO9sW_B7xvYmv4ic5K4K6KACvQPZnoVmcYAT5DcW_bhf1CCzJBMyaa4vzsif.fcYHMn8zYj2r7vtZLAqD3isPzBhX7EqGgJd2ptk3IKy_kOhF00mR3bMzCjY4Yy0DWcJ4uRwzibAy6n3ZFlZVq_rDuYfdvAwXv2hfE2IDdzxZw75Z7GzlqROyKkSBocgwxcrmy3bg.pAuwS23aIdl26zOGUI0nxQ_Yp_43UzjRVkeqTMg8oM92WOpMxnJ2q4A19W_aUOMr9uEe2_.T150; __cfruid=02d99e857fbb0d49c7ddf8c0885f20d59e6b3967-1744398508' };
            client.options.mfaToken = getMfa.token
            console.log(`[VanityDefender] MFA Token refreshed. (${getMfa.token.substring(0, 20)}-------------XXXX)`);
        }
        else console.log(`[VanityDefender] MFA Token failed`)
    } catch (error) {
        console.error("API ERROR\nFailed to refresh MFA token:", error);
    }

}

module.exports = { vanity_defender };
