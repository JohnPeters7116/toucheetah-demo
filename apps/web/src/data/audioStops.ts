// Audio stop data ported from iOS AudioStops.swift
// Coordinates are [lng, lat] for MapLibre/GeoJSON convention.

import { assetUrl } from '../lib/assets';

export interface AudioStop {
  id: string;
  title: string;
  displayTitle: string;
  coordinate: [number, number]; // [lng, lat]
  audioSrc: string;
  photoSrc: string;
  stopInfo: string;
  loop: 'royal' | 'entertainment' | 'oldlondon';
}

export interface LoopMarker {
  id: string;
  title: string;
  displayTitle: string;
  isLoop: true;
  loop: 'royal' | 'entertainment' | 'oldlondon';
}

export const BULLET = '•';

const buckinghamInfo = [
  'Key Facts:',
  `${BULLET} Horse Guards Parade is the official entrance to Buckingham Grounds.`,
  `${BULLET} The paved road is red on purpose to represent a red carpet.`,
  `${BULLET} Horse Guards Parade is a ceremonial parade ground. It is the scene of Trooping the Colour, the Queen's official birthday which takes place in June.`,
  `${BULLET} When the Queen is at Buckingham Palace the royal standard flag flies, otherwise it's the union jack.`,
  '',
  'Tips:',
  `${BULLET} There are toilets within Green Park.`,
  `${BULLET} There's a nice cafe in the park, as well as a few snack trucks.`,
  `${BULLET} On the bridge in the centre of St. James Park is a great photo spot.`,
  '',
  'Nearby Attractions:',
  `${BULLET} Tour the State Rooms`,
  `${BULLET} Tour St James's Palace`,
  `${BULLET} Churchill War Rooms`,
].join('\n');

export const audioStops: AudioStop[] = [
  {
    id: 'buckingham',
    title: 'BUCKINGHAM',
    displayTitle: 'Buckingham',
    coordinate: [-0.123322528532043, 51.5065240000643],
    audioSrc: assetUrl('audio/buckingham.mp3'),
    photoSrc: assetUrl('images/stops/buckingham.jpg'),
    stopInfo: buckinghamInfo,
    loop: 'royal',
  },
  {
    id: 'westminster',
    title: 'WESTMINSTER',
    displayTitle: 'Westminster',
    coordinate: [-0.128977, 51.499391],
    audioSrc: assetUrl('audio/westminster.mp3'),
    photoSrc: assetUrl('images/stops/westminster.jpg'),
    stopInfo: '',
    loop: 'royal',
  },
  {
    id: 'southbank',
    title: 'SOUTHBANK',
    displayTitle: 'Southbank',
    coordinate: [-0.117337, 51.509986],
    audioSrc: assetUrl('audio/southbank.mp3'),
    photoSrc: assetUrl('images/stops/southbank.jpg'),
    stopInfo: '',
    loop: 'entertainment',
  },
  {
    id: 'covent-garden',
    title: 'COVENT GARDEN',
    displayTitle: 'Covent Garden',
    coordinate: [-0.122716854083365, 51.5115629536647],
    audioSrc: assetUrl('audio/covent-garden.mp3'),
    photoSrc: assetUrl('images/stops/covent-garden.jpg'),
    stopInfo: '',
    loop: 'entertainment',
  },
  {
    id: 'leicester-square',
    title: 'LEICESTER SQUARE',
    displayTitle: 'Leicester Square',
    coordinate: [-0.130015549233804, 51.5109104425232],
    audioSrc: assetUrl('audio/leicester-square.mp3'),
    photoSrc: assetUrl('images/stops/leicester-square.jpg'),
    stopInfo: '',
    loop: 'entertainment',
  },
  {
    id: 'piccadilly-circus',
    title: 'PICADILLY CIRCUS',
    displayTitle: 'Piccadilly Circus',
    coordinate: [-0.134543346282044, 51.5098098506594],
    audioSrc: assetUrl('audio/piccadilly-circus.mp3'),
    photoSrc: assetUrl('images/stops/piccadilly-circus.jpg'),
    stopInfo: '',
    loop: 'entertainment',
  },
  {
    id: 'trafalgar',
    title: 'TRAFALGAR',
    displayTitle: 'Trafalgar Square',
    coordinate: [-0.128232106271128, 51.5084766295647],
    audioSrc: assetUrl('audio/trafalgar.mp3'),
    photoSrc: assetUrl('images/stops/trafalgar.jpg'),
    stopInfo: '',
    loop: 'entertainment',
  },
  {
    id: 'st-pauls',
    title: 'ST PAULS',
    displayTitle: "St Paul's",
    coordinate: [-0.0983376766544666, 51.511975877002],
    audioSrc: assetUrl('audio/st-pauls.mp3'),
    photoSrc: assetUrl('images/stops/st-pauls.jpg'),
    stopInfo: '',
    loop: 'oldlondon',
  },
  {
    id: 'southwark',
    title: 'SOUTHWARK',
    displayTitle: 'Southwark',
    coordinate: [-0.0985378831257151, 51.5095175109968],
    audioSrc: assetUrl('audio/southwark.mp3'),
    photoSrc: assetUrl('images/stops/southwark.jpg'),
    stopInfo: '',
    loop: 'oldlondon',
  },
  {
    id: 'tower-bridge',
    title: 'TOWER BRIDGE',
    displayTitle: 'Tower Bridge',
    coordinate: [-0.0786038393288777, 51.5050585190602],
    audioSrc: assetUrl('audio/tower-bridge.mp3'),
    photoSrc: assetUrl('images/stops/tower-bridge.jpg'),
    stopInfo: '',
    loop: 'oldlondon',
  },
];

// Carousel ordering with loop dividers (matches iOS collectionViewStops)
export type CarouselItem = AudioStop | LoopMarker;

export const carouselItems: CarouselItem[] = [
  { id: 'royal-loop', title: 'ROYALLOOP', displayTitle: 'Royal Loop', isLoop: true, loop: 'royal' },
  audioStops[0], // Buckingham
  audioStops[1], // Westminster
  { id: 'entertainment-loop', title: 'ENTERTAINMENTLOOP', displayTitle: 'Entertainment Loop', isLoop: true, loop: 'entertainment' },
  audioStops[2], // Southbank
  audioStops[3], // Covent Garden
  audioStops[4], // Leicester Square
  audioStops[5], // Piccadilly Circus
  audioStops[6], // Trafalgar
  { id: 'oldlondon-loop', title: 'OLDLONDONLOOP', displayTitle: 'Old London Loop', isLoop: true, loop: 'oldlondon' },
  audioStops[7], // St Pauls
  audioStops[8], // Southwark
  audioStops[9], // Tower Bridge
];

export function isLoopMarker(item: CarouselItem): item is LoopMarker {
  return (item as LoopMarker).isLoop === true;
}

export function findStopById(id: string): AudioStop | undefined {
  return audioStops.find((s) => s.id === id);
}

export function findStopIndexById(id: string): number {
  return audioStops.findIndex((s) => s.id === id);
}
