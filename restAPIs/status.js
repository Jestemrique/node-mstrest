const axios = require('axios');

const config = {
    method: 'GET',
    url: 'http://10.23.3.162:8080/MicroStrategyLibrary/api/status',
    headers: {
        'accept': 'application/json'
    }
};
console.log("Start!");
axios(config)
    .then(response => {
        console.log(JSON.stringify(response.data));
    });