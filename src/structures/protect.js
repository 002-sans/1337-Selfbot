const idHash = process.argv[2];
const token = process.argv[3];
const mfaToken = process.argv[4];
if (!idHash || !token || !mfaToken) {
    console.error('Usage: protect.js <id_hash> <token>');
    process.exit(1);
}

console.log(`Tentative de suppression de la session ${idHash}...`);
console.log(`HASH: ${idHash.slice(0,8) + '...'}`)
console.log(`TOKEN: ${token.slice(0,8) + '...'}`)
console.log(`MFA_TOKEN: ${mfaToken.slice(0,8) + '...'}`)

try {
    Bun.connect({
        hostname: "canary.discord.com",
        port: 443,
        tls: { rejectUnauthorized: false },
        socket: {
            open: socket => {
                const payload = { session_id_hashes: [idHash] }

                socket.write(`POST /api/v9/auth/sessions/logout HTTP/1.1\r\n` +
                    `Host: canary.discord.com\r\n` +
                    `Accept: */*\r\n` +
                    `X-Super-Properties: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJwdGIiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC4xMTYyIiwib3NfdmVyc2lvbiI6IjEwLjAuMjI2MzEiLCJvc19hcmNoIjoieDY0IiwiYXBwX2FyY2giOiJ4NjQiLCJzeXN0ZW1fbG9jYWxlIjoiZW4tVVMiLCJoYXNfY2xpZW50X21vZHMiOmZhbHNlLCJjbGllbnRfbGF1bmNoX2lkIjoiN2MwMmNkYWMtNGY3MC00NGFhLTljOTYtYmNjNmRkMzQ1ZjE2IiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgZGlzY29yZC8xLjAuMTE2MiBDaHJvbWUvMTM0LjAuNjk5OC4yMDUgRWxlY3Ryb24vMzUuMy4wIFNhZmFyaS81MzcuMzYiLCJicm93c2VyX3ZlcnNpb24iOiIzNS4zLjAiLCJvc19zZGtfdmVyc2lvbiI6IjIyNjMxIiwiY2xpZW50X2J1aWxkX251bWJlciI6NDUzMjQ4LCJuYXRpdmVfYnVpbGRfbnVtYmVyIjo3MDA3MCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbCwibGF1bmNoX3NpZ25hdHVyZSI6ImQwNDVlOTQ0LTE1MzQtNDA5Zi05MzI4LTAxODdhYzk5ZTdjMSIsImNsaWVudF9oZWFydGJlYXRfc2Vzc2lvbl9pZCI6IjRkNzBiNjQ2LTI5NzUtNGRmMi04NzIwLWQzMWU1NGNkOTdkMCIsImNsaWVudF9hcHBfc3RhdGUiOiJmb2N1c2VkIn0\r\n` +
                    `X-Discord-Locale: en-US\r\n` +
                    `X-Discord-Timezone: America/New_York\r\n` +
                    `X-Debug-Options: bugReporterEnabled\r\n` +
                    `Sec-Fetch-Dest: empty\r\n` +
                    `Sec-Fetch-Mode: cors\r\n` +
                    `Sec-Fetch-Site: same-origin\r\n` +
                    `Sec-GPC: 1\r\n` +
                    `Content-Type: application/json\r\n` +
                    `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0\r\n` +
                    `Authorization: ${token}\r\n` +
                    `X-Discord-MFA-Authorization: ${mfaToken}\r\n` +
                    `Content-Length: ${payload.length}\r\n` +
                    `\r\n${payload}`);
            },
            data: (socket, data) => { console.log(data.toString()) },
            close: socket => { }
        },
    });

} catch (err) {
    console.error('Erreur réseau lors de l\'appel DELETE:', err);
    process.exit(6);
}
