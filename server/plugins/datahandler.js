let holes = [
  { hole: 1, pub: "All Bar One", drink: "Espresso Martini", score: 0, par: 2 },
  {
    hole: 2,
    pub: "Crooked Billet",
    drink: "Free Choice (Pint)",
    score: 0,
    par: 4,
  },
  { hole: 3, pub: "Hand in Hand", drink: "Ale", score: 0, par: 4 },
  { hole: 4, pub: "The Alex", drink: "Fosters", score: 0, par: 3 },
  { hole: 5, pub: "Hand & Racquet", drink: "Merlot", score: 0, par: 3 },
  { hole: 6, pub: "Prince of Wales", drink: "Guinness", score: 0, par: 2 },
  { hole: 7, pub: "The Garratt & Gauge", drink: "Cider", score: 0, par: 4 },
  {
    hole: 8,
    pub: "The Wibbas Down Inn",
    drink: "Sambuca / Tequila",
    score: 0,
    par: 1,
  },
  { hole: 9, pub: "The Old Frizzle", drink: "Beer", score: 0, par: 3 },
];

let users = [];

export default defineNitroPlugin(async (event) => {});

export async function submitUser(user) {
  let generatedId;
  let idExists = true;

  while (idExists) {
    generatedId = generateRandomCode();
    idExists = users.some((u) => u.code === generatedId);
  }
  user.id = users.length + 1;
  user.code = generatedId;
  user.score = 0;
  user.holes = holes;
  user.created_at = new Date();
  users.push(user);
  return user;
}

export async function leaderboard() {
  let usersSorted = JSON.parse(
    JSON.stringify(users.sort((a, b) => a.score - b.score))
  );
  let leaderboard = usersSorted.map((user, index) => {
    let totalHolesCompleted = 0;
    if (user.holes) {
      for (let c = 0; c < user.holes.length; c++) {
        if (user.holes[c].score > 0) {
          totalHolesCompleted++;
        }
      }
    }
    user.order = index + 1;
    user.holes_played = totalHolesCompleted;
    delete user.holes;
    delete user.code;

    return user;
  });
  let finalLeaderboard = JSON.parse(
    JSON.stringify(
      leaderboard.sort((a, b) => {
        // First, compare holes_played in descending order
        if (b.holes_played !== a.holes_played) {
          return b.holes_played - a.holes_played;
        }
        // If holes_played are equal, compare scores in ascending order
        return a.score - b.score;
      })
    )
  );
  return finalLeaderboard;
}
export async function getUser(code) {
  let user = users.find((user) => user.code == code);
  if (user) {
    return user;
  } else {
    return null;
  }
}
export async function updateUser(user) {
  let userIndex = users.findIndex((u) => u.code == user.code);
  let totalScore = 0;
  for (let c = 0; c < user.holes.length; c++) {
    totalScore = totalScore + user.holes[c].score;
  }
  user.score = totalScore;
  if (userIndex >= 0) {
    users[userIndex] = user;
    return users[userIndex];
  } else {
    // users.push(user);
    return user;
  }
}
export async function deleteUser(id) {}

export async function wipeUsers() {
  users = [];
}

function generateRandomCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    code += letters[randomIndex];
  }
  return code;
}
