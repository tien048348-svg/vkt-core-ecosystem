import { buildScriptWriterPrompt } from './src/data/prompts';
import { TARGET_MARKETS } from './src/data/constants';
import { DHARMA_NICHES } from './src/data/nicheConfig';

const testNiche = DHARMA_NICHES.find(n => n.id === 'default');
const testMarket = TARGET_MARKETS['vn_dharma'];

if (testNiche && testMarket) {
    const prompt = buildScriptWriterPrompt(testNiche, testMarket, 'Dharma test context');
    console.log(prompt);
} else {
    console.log('Error loading config');
}
