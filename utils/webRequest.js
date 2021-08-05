const https = require('https');

const getRequest = url => {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			let data = '';
		
			// A chunk of data has been received
			res.on('data', (chunk) => {
				data += chunk;
			});
		
			// The whole response has been received
			res.on('end', () => {
				console.log(data);
				resolve(JSON.parse(data));
			});
		
		}).on("error", (err) => {
			reject(err.message);
		});
	});
};

module.exports = {
	getRequest
};