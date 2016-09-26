let https = require('https');

function httpRequest(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, function(response) {
                let body = '';

                response.on('data', (chunk) => {
                    body += chunk;
                });

                response.on('end', () => resolve(body));
            })
            .on('error', reject);
    });
}

module.exports = httpRequest;