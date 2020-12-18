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

const showAccordion = (elemToggled, elemParent, fixHeight) => {
	const showList = () => {
		elemToggled.classList.add('active');
		elemParent.classList.add('show');
		elemToggled.style.height = 'auto';

		let height = `${elemToggled.clientHeight}px`;

		elemToggled.style.height = '0px';

		setTimeout(() => {
			elemToggled.style.height = height;
		}, 0);
	};

	if (fixHeight === 'Y') {
		if (elemToggled.classList.contains('active')) {
			showList();
		}
	} else if (!elemToggled.classList.contains('active')) {
		showList();
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

const formData = (() => {
	const infoContainer = document.querySelector('.configurator__list');
	const valueClass = 'list-value';
	let dataInput = {};

	const newElement = (inputTitle, inputKey, inputValue) => {
		const divElem = document.createElement('div');
		divElem.id = `info-${inputKey}`;
		dataInput[inputKey] = divElem;
		divElem.innerHTML = `<b>${inputTitle}: </b><span class="${valueClass}">${inputValue}</span>`;
		infoContainer.append(divElem);

		const accordionList = document.querySelector('.configurator__list');
		const accordion = document.querySelector('.configurator__total-block');
		showAccordion(accordionList, accordion, 'Y');
	};

	const changeElement = (inputKey, inputValue) => {
		console.log(dataInput[inputKey]);
		dataInput[inputKey].querySelector(`.${valueClass}`).innerHTML = inputValue;
	};

	const deleteElement = (inputKey) => {
		dataInput[inputKey].parentNode.removeChild(dataInput[inputKey]);
		delete dataInput[inputKey];

		const accordionList = document.querySelector('.configurator__list');
		const accordion = document.querySelector('.configurator__total-block');
		showAccordion(accordionList, accordion, 'Y');
	};

	const changeInfo = (inputElement) => {
		let inputKey = inputElement.name;
		let inputTitle = inputElement.dataset.codeTitle;
		let inputValue = inputElement.value;
		if (inputElement.dataset.add === 'Y') {
			if (dataInput[inputKey]) {
				deleteElement(inputKey);
			}
		} else if (!dataInput[inputKey]) {
			newElement(inputTitle, inputKey, inputValue);
		} else if (dataInput[inputKey] !== inputElement.value) {
			changeElement(inputKey, inputValue);
		}
	};

	const initAccordionEvent = () => {
		const accordionName = document.querySelector('.accordion__name_total');
		const accordionList = document.querySelector('.configurator__list');
		const accordion = document.querySelector('.configurator__total-block');
		accordionName.addEventListener('click', () => {
			showAccordion(accordionList, accordion);
		});
	};

	return {
		init: (formSelector, listenerElem, classInputParent) => {
			initAccordionEvent();
			listenerElem.addEventListener('click', (e) => {
				if (e.target.closest(classInputParent)) {
					changeInfo(e.target.closest(classInputParent).querySelector('input'));
				}
			});
		},
	};
})();

const accordionStartFn = (() => {
	const accordionListGenerate = (dataItem, listName, key, dataTitle) => {
		const accordionListIn = document.createElement('div');
		// console.log(dataItem);
		accordionListIn.innerHTML = `
		<div class="radio-btn accordion__item ${dataItem.add ? 'disabled' : ''}">
			<input name="${listName}" id="accordion-${listName}-${dataItem.id}" type="radio" ${key === 0 ? 'checked' : ''} value="${dataItem.text}" data-code-title="${dataTitle}" ${dataItem.add === false ? 'data-add="Y"' : ''}>
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
			accordionList.append(accordionListGenerate(dataItem, listName, subKey, data.title));
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
