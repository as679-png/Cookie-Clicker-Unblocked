// config.js
export const SAVE_KEY = "crumb-co-save-v1";

export const buildings = [
  { id: "finger", name: "Sticky Finger", icon: "SF", desc: "A helping thumb that taps a cookie for you.", baseCost: 15, cps: 0.1 },
  { id: "granny", name: "Granny's Hands", icon: "GH", desc: "Bakes a batch from muscle memory alone.", baseCost: 100, cps: 1 },
  { id: "oven", name: "Toaster Oven", icon: "TO", desc: "Small, but it never once cools down.", baseCost: 1100, cps: 8 },
  { id: "bakery", name: "Corner Bakery", icon: "CB", desc: "A whole shopfront dedicated to dough.", baseCost: 12000, cps: 47 },
  { id: "van", name: "Delivery Van", icon: "DV", desc: "Restocks flour and sugar before you run out.", baseCost: 130000, cps: 260 },
  { id: "factory", name: "Cookie Factory", icon: "CF", desc: "Industrial belts, industrial batches.", baseCost: 1400000, cps: 1400 },
  { id: "tower", name: "Sugar Tower", icon: "ST", desc: "A silo that turns raw cane into pure output.", baseCost: 20000000, cps: 7800 },
];

export const upgrades = [
  { id: "spoon", name: "Reinforced Spoon", desc: "Doubles cookies per tap.", cost: 100, requires: (state) => true, apply: (state) => { state.clickMult *= 2; } },
  { id: "mittens", name: "Warm Mittens", desc: "Grannies work 50% faster.", cost: 500, requires: (state) => state.owned.granny >= 1, apply: (state) => { state.buildingMult.granny *= 1.5; } },
  { id: "trays", name: "Non-stick Trays", desc: "Ovens produce 50% more.", cost: 5000, requires: (state) => state.owned.oven >= 1, apply: (state) => { state.buildingMult.oven *= 1.5; } },
  { id: "whisk", name: "Golden Whisk", desc: "Doubles cookies per tap again.", cost: 10000, requires: (state) => true, apply: (state) => { state.clickMult *= 2; } },
  { id: "belts", name: "Assembly Line", desc: "Factories produce 50% more.", cost: 500000, requires: (state) => state.owned.factory >= 1, apply: (state) => { state.buildingMult.factory *= 1.5; } },
];
