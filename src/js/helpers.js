let vars = {};

const debounced = [];
const cancelFunc = (timeout) => () => {
	clearTimeout(timeout);
};

vars.debounce = (fn, wait, ...args) => {
	let d = debounced.find(({funcString}) => funcString === fn.toString());

	if (d) {
		d.cancel();
	} else {
		d = {};
		debounced.push(d);
	}

	d.func = fn;
	d.funcString = fn.toString();
	d.timeout = setTimeout(fn, wait, ...args);
	d.cancel = cancelFunc(d.timeout);
};

export default vars;
