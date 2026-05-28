// Directional arrow positions ported from iOS TourRoute.swift
// Coordinates are [lng, lat] for GeoJSON convention.

export type Coord = [number, number];

export const walkingArrowsUp: Coord[] = [
  [-0.127234078757851, 51.5003290330926], // Royal Loop
  [-0.120330907729567, 51.5093223712741], // Entertainment Loop
  [-0.0745975992652177, 51.5068083748334], // Old London Loop
];

export const walkingArrowsDown: Coord[] = [
  [-0.129615211329735, 51.5002963086635], // Royal Loop
  [-0.132764856906107, 51.5095976667404], // Entertainment Loop
  [-0.098385838701148, 51.5115306479527], // Old London Loop
  [-0.0985655045745375, 51.5090260144474],
];

export const walkingArrowsLeft: Coord[] = [
  [-0.12878553010961, 51.5012459001501], // Royal Loop
  [-0.118117783288284, 51.5097249702454], // Entertainment Loop
  [-0.127410213267154, 51.5109670869554],
  [-0.0979006317022026, 51.5119506481596], // Old London Loop
];

export const walkingArrowsRight: Coord[] = [
  [-0.128169590033735, 51.4997218477345], // Royal Loop
  [-0.129758597840834, 51.5081508686608], // Entertainment Loop
  [-0.12613930618204, 51.5071725845227],
  [-0.0939002525712738, 51.5078125164889], // Old London Loop
  [-0.0783081692223675, 51.5050398989441],
];

export const bikingArrowsUp: Coord[] = [
  [-0.123329530115655, 51.5035586529654], // Royal Loop
  [-0.0971588604947442, 51.5115525663926], // Old London Loop
];

export const bikingArrowsDown: Coord[] = [
  [-0.124512203892863, 51.5056410597409], // Royal Loop
];

export const bikingArrowsLeft: Coord[] = [
  [-0.1375560582932, 51.5030704467769], // Royal Loop
  [-0.0875786656237949, 51.5097709297463], // Old London Loop
];

export const bikingArrowsRight: Coord[] = [
  [-0.126137808823472, 51.5009511592903], // Royal Loop
  [-0.132986379401672, 51.5010394644376],
  [-0.127908998358294, 51.5011225947443],
  [-0.0839024255906509, 51.5049114568071], // Old London Loop
];
