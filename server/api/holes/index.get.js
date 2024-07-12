let holes = [
  { hole: 1, pub: "All Bar One", drink: "Espresso Martini", par: 2 },
  {
    hole: 2,
    pub: "Crooked Billet",
    drink: "Free Choice (Pint)",
    par: 4,
  },
  { hole: 3, pub: "Hand in Hand", drink: "Ale", par: 4 },
  { hole: 4, pub: "The Alex", drink: "Fosters", par: 3 },
  { hole: 5, pub: "Hand & Racquet", drink: "Merlot", par: 3 },
  { hole: 6, pub: "Prince of Wales", drink: "Guinness", par: 2 },
  { hole: 7, pub: "The Garratt & Gauge", drink: "Cider", par: 4 },
  {
    hole: 8,
    pub: "The Wibbas Down Inn",
    drink: "Sambuca / Tequila",
    par: 1,
  },
  { hole: 9, pub: "The Old Frizzle", drink: "Beer", par: 3 },
];

export default defineEventHandler(async (event) => {
  return holes;
});
