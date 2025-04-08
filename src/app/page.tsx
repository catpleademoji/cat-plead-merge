"use client"
import { CatAssetData, ParticleAssetData, SoundEffectAssetData } from "@/assets/AssetData";
import { CatPleadMerge } from "@/CatPleadMerge";
import "./page.css";

const catData: CatAssetData[] = [
  {
    name: "cat-pensive",
    src: "/images/cats/cat-pensive.png",
    score: 1,
  },
  {
    name: "cat-angry",
    src: "/images/cats/cat-angry.png",
    score: 2,
  },
  {
    name: "cat-tears",
    src: "/images/cats/cat-tears.png",
    score: 3,
  },
  {
    name: "cat-sobbing",
    src: "/images/cats/cat-sobbing.png",
    score: 4,
  },
  {
    name: "cat-sunglasses",
    src: "/images/cats/cat-sunglasses.png",
    score: 6,
  },
  {
    name: "cat-dizzy",
    src: "/images/cats/cat-dizzy.png",
    score: 8,
  },
  {
    name: "cat-sleeping",
    src: "/images/cats/cat-sleeping.png",
    score: 11,
  },
  {
    name: "cat-three-hearts",
    src: "/images/cats/cat-three-hearts.png",
    score: 16,
  },
  {
    name: "cat-flushed",
    src: "/images/cats/cat-flushed.png",
    score: 23,
  },
  {
    name: "cat-nerd",
    src: "/images/cats/cat-nerd.png",
    score: 32,
  },
  {
    name: "cat-plead",
    src: "/images/cats/cat-plead.png",
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
