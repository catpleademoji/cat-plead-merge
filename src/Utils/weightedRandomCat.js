import { lerp, random } from "./math.js";

export default function weightedRandomCat(cats, score, highest_cat) {
  const limit = 4 + (score > 0 ? Math.floor(Math.log10(score)) : 0);
  const weights = cats.slice(0, Math.min(limit, cats.length)).map(x => 1 / x.score);
  const totalWeight = weights.reduce((total, invScore) => total + invScore, 0);
  const average = 1 / weights.length;
  const normalizedWeights = weights.map(x => x / totalWeight)
    .map(x => lerp(x, average, highest_cat / cats.length ));

  let randomValue = Math.random();
  let index = 0;
  for (let i = normalizedWeights.length - 1; i >= 0; i--) {
    if (randomValue < normalizedWeights[i]) {
      index = i;
      break;
    }
    randomValue -= normalizedWeights[i]; 
  }

  const cat = {
    ...cats[index],
    rotation: random.angle(),
  };

  return cat;
}