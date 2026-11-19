import test from 'node:test';
import assert from 'node:assert/strict';
import './helpers.mjs';
import { gloss, englishToNorsund } from '../norsund/translate.js';

const GLOSSES = [
  ['Tyr kjolder murin i nimin.', 'Tyr guard-PRS wall-DEF in night-DEF'],
  ['I nimin kjolder Tyr murin.', 'in night-DEF guard-PRS Tyr wall-DEF'],
  ['Fjol starin lyser run ne.', 'under star-DEF shine-PRS rune NEG'],
  ['Tyr kjoldade murin, sa.', 'Tyr guard-PST wall-DEF EVID.SEEN'],
  ['Tyr kjoldade murin, sund.', 'Tyr guard-PST wall-DEF EVID.SUNG'],
  ['Tyr hal kjolda murin, stari.', 'Tyr FUT guard-INF wall-DEF EVID.FATED'],
  ['Kjolder dy murin?', 'guard-PRS 2SG wall-DEF'],
  ['Tyr kjolder ne murin.', 'Tyr guard-PRS NEG wall-DEF'],
  ['Ma staren kjolda dun!', 'OPT star-PL.AN guard-INF 2PL.OBJ'],
  ['Em skyner ke Tyr ne kjolder murin.', '1SG know-PRS REL Tyr NEG guard-PRS wall-DEF'],
  ['Murin vas kjoldad ur Tyr.', 'wall-DEF be.PST guard-PTCP out.of Tyr'],
];

test('interlinear glosses of grammar examples (V2, negation, evidentials)', () => {
  for (const [s, g] of GLOSSES) assert.equal(gloss(s).gloss, g, s);
});

const TRANSLATIONS = [
  ['Tyr guards the wall.', 'Tyr kjolder murin.'], ['Tyr guarded the wall.', 'Tyr kjoldade murin.'], ['Tyr will guard the wall.', 'Tyr hal kjolda murin.'],
  ['Tyr does not guard the wall.', 'Tyr kjolder ne murin.'], ['Do you guard the wall?', 'Kjolder dy murin?'], ['Who guarded the wall?', 'Kum kjoldade murin?'],
  ['At night, Tyr guards the wall.', 'I nimin kjolder Tyr murin.'], ['Tyr guards the wall at night.', 'Tyr kjolder murin i nimin.'],
  ['Tyr has guarded the wall.', 'Tyr ager kjoldad murin.'], ['The wall was guarded by Tyr.', 'Murin vas kjoldad ur Tyr.'], ['She is brave.', 'Sel es thiol.'],
  ['Tyr is braver than Ulf.', 'Tyr es thiolar thon Ulf.'], ['I see you.', 'Em sajer du.'], ['I cannot ride.', 'Em orker ne rida.'], ['It is snowing.', 'At drifer.'],
  ['Beneath the star, no rune shines.', 'Fjol starin lyser run ne.'], ['I know that Tyr does not guard the wall.', 'Em skyner ke Tyr ne kjolder murin.'],
  ["Don't drink!", 'Ne kjal!'], ["Tyr's two sharp blades", 'Tyri dov skarp kyrar'], ['this blade', 'hes kyrin'], ['Where is she going?', 'Kur ganer sel?'],
  ['Tyr sees himself in the water.', 'Tyr sajer sjo i ylvin.'], ['I saw that Tyr guarded the wall.', 'Tyr kjoldade murin, sa.'],
  ['There is a rune in the wall.', 'I murin es run.'], ['The blade is sharp.', 'Kyrin es skarp.'], ['the edge of the blade', 'kyrini tyr'],
  ['If I were brave, I would ride.', 'Sof em vas thiol, em halde rida.'], ['What do you see?', 'Kut sajer dy?'],
  ['the free swords who guarded the wall', 'Vilkyrene ke kjoldade murin'],
];

test('English to Norsund on the grammar examples', () => {
  for (const [en, ns] of TRANSLATIONS) assert.equal(englishToNorsund(en).norsund, ns, en);
});

test('translation reports unknown words and Starisund stars', () => {
  const r = englishToNorsund('The zorblax guards the wall.');
  assert.deepEqual(r.unknown, ['zorblax']);
  assert.equal(englishToNorsund('May the stars guard you!', { dialect: 'starisund', pluralYou: true }).norsund, 'Ma starene kjolda dun!');
});

test('irregular English past tenses win in verb position', async () => {
  const { englishToNorsund } = await import('../norsund/translate.js');
  assert.match(englishToNorsund('I saw the wolf.').norsund, /^Em sa ulfin\.?$/i);
});
