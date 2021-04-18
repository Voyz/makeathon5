import axios from "axios";

const paramsBaseUrl = process.env.REACT_APP_PARAMS_BASE_URL ? process.env.REACT_APP_PARAMS_BASE_URL : 'https://raw.githubusercontent.com/Voyz/makeathon5_params/master/';
const paramsDefaultPath = process.env.REACT_APP_PARAMS_DEFAULT_PATH ? process.env.REACT_APP_PARAMS_DEFAULT_PATH : './default_params/';

export async function downloadParam (filename) {
	const paramUrl = paramsBaseUrl + filename;
	console.log(`Downloading param from ${paramUrl}`);
	try {
		const param = await axios.get(paramUrl);
		if (!param.data) {
			console.log(`Invalid param from ${paramUrl}`);
			return null;
		}  else {
			console.log(`Valid param from ${paramUrl}`);
			return param.data
		}
	} catch (err) {
		console.error(err);
		return null;
	}
}

const acquireParam = async (filename) => {

	let param = await downloadParam(filename);

	if (param === null){
		console.error(`Param download failed, attempting to read a local copy of the param: ${filename}`);
		try {
			const imported = await import(`${paramsDefaultPath}${filename}`);
			param = imported.default;
		} catch (err){
			console.error(err);
			param = null;
		}
	}

	return param;
};


export async function getParams() {

	const summary = await acquireParam('params_summary.json');
	const sentiment = await acquireParam('params_sentiment.json');

	return {summary, sentiment}
}

