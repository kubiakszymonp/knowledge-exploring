export type Place = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export const places: Place[] = [
  {
    id: "brama_florianska",
    name: "Brama Floriańska",
    image: "https://picsum.photos/seed/brama-tile/600/400",
    description: "Gotycka brama miejska z XIV wieku",
  },
  {
    id: "sukiennice",
    name: "Sukiennice",
    image: "https://picsum.photos/seed/sukiennice/600/400",
    description: "Renesansowe centrum handlu",
  },
  {
    id: "wawel",
    name: "Zamek Królewski na Wawelu",
    image: "https://picsum.photos/seed/wawel-castle/600/400",
    description: "Siedziba polskich królów",
  },
];

