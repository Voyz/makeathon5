import axios from "axios";

const promptsBaseUrl = process.env.REACT_APP_PROMPTS_BASE_URL ? process.env.REACT_APP_PROMPTS_BASE_URL : 'https://raw.githubusercontent.com/Voyz/makeathon5_prompts/master/';
const promptsDefaultPath = process.env.REACT_APP_PROMPTS_BASE_URL ? process.env.REACT_APP_PROMPTS_BASE_URL : './default_prompts/';

export async function downloadPrompt (filename) {
	const promptUrl = promptsBaseUrl + filename;
	console.log(`Downloading prompt from ${promptUrl}`);
	try {
		const prompt = await axios.get(promptUrl);
		if (!prompt.data) {
			console.log(`Invalid prompt from ${promptUrl}`);
			return null;
		}  else {
			console.log(`Valid prompt from ${promptUrl}`);
			return prompt.data
		}
	} catch (err) {
		console.error(err);
		return null;
	}
}

const acquirePrompt = async (filename) => {


	let prompt = await downloadPrompt(filename);

	if (prompt === null){
		console.error(`Prompt download failed, attempting to read a local copy of the prompt: ${filename}`);
		try {
			const imported = await import(`${promptsDefaultPath}${filename}`);
			prompt = imported.default;
		} catch (err){
			console.error(err);
			prompt = null;
		}
	}

	return prompt;
};


export async function getPrompts() {

	const summary = await acquirePrompt('prompt_summary.json');
	const sentiment = await acquirePrompt('prompt_sentiment.json');
	// summary: acquirePrompt('index.html')

	return {summary, sentiment}
}

