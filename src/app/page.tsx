"use client"
import { CatAssetData, ParticleAssetData, SoundEffectAssetData } from "@/assets/AssetData";
import { CatPleadMerge } from "@/CatPleadMerge";
import "./page.css";

// function useAssets(assets: AssetManifest) {
//   const [isLoaded, setIsLoaded] = useState<boolean>(false);
//   const [cats, setCats] = useState<Cat[]>();
//   const [particles, setParticles] = useState<Particle[]>();
//   const [soundEffects, setSoundEffects] = useState<SoundEffect[]>();
//   function loadCats() {
//     const catPromises = catData.map<Promise<Cat>>(async (catData, index) => {
//       const image = new Image(catData.size, catData.size);
//       image.src = catData.src;
//       await image.decode();
//       return {
//         id: index,
//         name: catData.name,
//         imageSrc: catData.src,
//         image: image,
//         size: catData.size,
//         score: catData.score,
//       } satisfies Cat;
//     });
//     Promise.all(catPromises)
//       .then(cats => {
//         setCats(cats);
//       });
//   }
//   function loadParticles() {
//     const particlePromises = particleData.map(async (particleData, index) => {
//       const image = new Image();
//       image.src = particleData.src;
//       await image.decode();
//       return {
//         id: index,
//         name: particleData.name,
//         imageSrc: particleData.src,
//         image: image,
//         size: particleData.size,
//       } satisfies Particle;
//     });
//     Promise.all(particlePromises)
//       .then(particles => {
//         setParticles(particles);
//       });
//   }
//   function loadSoundEffects() {
//     const soundEffectPromises = soundEffectData.map(async (soundEffectData, index) => {
//       if (typeof soundEffectData.src === "string") {
//         const audio = await fetch(soundEffectData.src);
//         const audioBase64Data = await audio.text();
//         const byteString = atob(audioBase64Data);
//         const arrayBuffer = new ArrayBuffer(byteString.length);
//         const view = new Uint8Array(arrayBuffer);
//         for (let i = 0; i < byteString.length; i++) {
//           view[i] = byteString.charCodeAt(i);
//         }
//         return arrayBuffer;
//         // return audioContext.decodeAudioData(arrayBuffer);
//       } else {
//       }
//     });
//     Promise.all(soundEffectPromises)
//       .then(soundEffects => {
//         setSoundEffects(soundEffects);
//       });
//   }
//   useEffect(() => {
//     loadCats();
//     loadParticles();
//     loadSoundEffects();
//   });
//   useEffect(() => {
//     if (!assets) {
//       setIsLoaded(true);
//       return;
//     }
//     Object.entries(assets)
//       .map(([key, assetSrcs]) => {
//         return assetSrcs.map(async assetSrc => {
//           switch (assetSrc.type) {
//             case "Image":
//               const image = new Image();
//               image.src = assetSrc.type;
//               await image.decode();
//               return {
//                 image,
//                 ...assetSrc
//               }
//             case "Audio":
//               break;
//             default:
//               throw new Error("Unsupported asset type :(");
//           }
//         });
//       });
//   }, [assets]);
//   return [assets, isLoaded];
// }

const catData: CatAssetData[] = [
  {
    name: "cat-pensive",
    src: "/images/cat-pensive.svg",
    size: 18,
    score: 1,
  },
  {
    name: "cat-dizzy",
    src: "/images/cat-dizzy.svg",
    size: 23,
    score: 2,
  },
  {
    name: "cat-flushed",
    src: "/images/cat-flushed.svg",
    size: 29,
    score: 3,
  },
  {
    name: "cat-tears",
    src: "/images/cat-tears.svg",
    size: 36,
    score: 4,
  },
  {
    name: "cat-angry",
    src: "/images/cat-angry.svg",
    size: 45,
    score: 6,
  },
  {
    name: "cat-sleeping",
    src: "/images/cat-sleeping.svg",
    size: 57,
    score: 8,
  },
  {
    name: "cat-sobbing",
    src: "/images/cat-sobbing.svg",
    size: 72,
    score: 11,
  },
  {
    name: "cat-raised-eyebrow",
    src: "/images/cat-raised-eyebrow.svg",
    size: 91,
    score: 16,
  },
  {
    name: "cat-three-hearts",
    src: "/images/cat-three-hearts.svg",
    size: 114,
    score: 23,
  },
  {
    name: "cat-nerd",
    src: "/images/cat-nerd.svg",
    size: 144,
    score: 32,
  },
  {
    name: "cat-plead",
    src: "/images/cat-plead.svg",
    size: 181,
    score: 45,
  },
];

const particleData: ParticleAssetData[] = [
  {
    name: "sparkles",
    src: "/images/particles/sparkles.svg",
    size: 20,
  },
  {
    name: "heart",
    src: "/images/particles/heart.svg",
    size: 16,
  },
];

const soundEffectData: SoundEffectAssetData[] = [
  {
    name: "pop",
    src: [
      "/audio/pop-1.txt",
      "/audio/pop-2.txt",
      "/audio/pop-3.txt",
    ],
  }
];

export default function Home() {
  return <>
    <CatPleadMerge id="game-canvas" assets={{
      cats: catData,
      particles: particleData,
      soundEffects: soundEffectData,
    }} />
  </>
}
