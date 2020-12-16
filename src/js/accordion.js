const accordionParentBlock = document.getElementById('js-generate-service');

const https = require('https');

const getJSON = (url) => {
	return new Promise((resolve, reject) => {
		const req = https.get(url, (res) => {
			let json = '';
			res.on('data', (chunk) => {
				json += chunk;
			});
			res.on('end', () => {
				resolve(JSON.parse(json));
			});
		});
		req.on('error', (err) => {
			reject(err);
		});
	});
};

const accordionGenerateStartFn = (jsonData) => {
	// accordionParentBlock.innerHTML = '';
	jsonData.forEach(() => {

	});
};

// начальная функция - получает json файл и в случае успеха идет по цепочки для генерации html и добавления в dom
getJSON('/json/data.json').then((jsonData) => {
	console.log(jsonData);
	accordionGenerateStartFn(jsonData);
}).catch((error) => {
	console.log(error);
});
