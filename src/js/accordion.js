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

const formData = (() => {
	let formElem;
	let dataInput = {};

	const changeInfo = (inputElement) => {
		let inputKey = inputElement.name;
		dataInput[inputKey] = inputElement.value;
		console.log(dataInput);
	};

	return {
		init: (formSelector, listenerElem, inputParent) => {
			formElem = document.querySelector('.form-configurator');
			console.log(listenerElem);
			listenerElem.addEventListener('click', (e) => {
				if (e.target.closest(inputParent)) {
					changeInfo(e.target.closest(inputParent).querySelector('input'));
				}
			});
		},
	};
})();

const accordionStartFn = (() => {
	const showAccordion = (elemToggled, elemParent) => {
		if (!elemToggled.classList.contains('active')) {
			elemToggled.classList.add('active');
			elemParent.classList.add('show');
			elemToggled.style.height = 'auto';

			let height = `${elemToggled.clientHeight}px`;

			elemToggled.style.height = '0px';

			setTimeout(() => {
				elemToggled.style.height = height;
			}, 0);
		} else {
			elemToggled.style.height = '0px';

			elemToggled.addEventListener('transitionend', () => {
				elemToggled.classList.remove('active');
				elemParent.classList.remove('show');
			}, {
				once: true,
			});
		}
	};

	const accordionListGenerate = (dataItem, listName, key) => {
		const accordionListIn = document.createElement('div');
		// console.log(dataItem);
		accordionListIn.innerHTML = `
		<div class="radio-btn accordion__item ${dataItem.add ? 'disabled' : ''}">
		<input name="${listName}" id="accordion-${listName}-${dataItem.id}" type="radio" ${key === 0 ? 'checked' : ''} value="${dataItem.text}">
		<label for="accordion-${listName}-${dataItem.id}">${dataItem.text}
		${dataItem.extend ? `<span>${dataItem.extend}</span>` : ''}</label>
		</div>`;

		return accordionListIn;
	};

	const accordionNameGenerate = (data) => {
		const accordion = document.createElement('div');
		const accordionName = document.createElement('div');
		const accordionList = document.createElement('div');
		const dataItemsList = data.config;
		const listName = data.code;
		let subKey = 0;
		accordionList.classList.add('accordion__list');
		accordion.classList.add('accordion');
		accordionName.classList.add('accordion__name');
		accordionName.innerText = data.title;
		accordionName.addEventListener('click', () => {
			showAccordion(accordionList, accordion);
		});
		accordion.append(accordionName);
		dataItemsList.forEach((dataItem, key) => {
			if (key === 0 && dataItem.add !== true) {
				subKey = 0;
			} else if (dataItem.add === true) {
				subKey = 1;
			} else if (dataItem.add !== true && subKey === 1) {
				subKey = 0;
			} else {
				subKey = 2;
			}
			accordionList.append(accordionListGenerate(dataItem, listName, subKey));
		});
		accordion.append(accordionList);

		return accordion;
	};

	return {
		init: (jsonData) => {
			jsonData.forEach((data) => {
				accordionParentBlock.append(accordionNameGenerate(data));
			});
		},
	};
})();

// начальная функция - получает json файл и в случае успеха идет по цепочки для генерации html и добавления в dom
getJSON('/json/data.json').then((jsonData) => {
	accordionStartFn.init(jsonData);
	formData.init('.form-configurator', accordionParentBlock, '.accordion__item');
}).catch((error) => {
	console.log(error);
});
