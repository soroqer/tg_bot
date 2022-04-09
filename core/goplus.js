const http = require('http');



exports.search = function (address, onResult) {
    const options = {
        hostname: 'api.gopluslabs.io',
        path: '/api/v1/token_security/56?contract_addresses=' + address,
        method: 'GET'
    }
    let datas = '';
    const req = http.request(options, res => {
        res.on('data', data => {
            datas += data;
        })
        res.on('end', function () {
            let json = JSON.parse(datas);
            onResult(json.result);
        })
    })
    req.on('error', error => {
        console.log('http-on-err',error)
        onResult({})
    })

    req.end()
}
