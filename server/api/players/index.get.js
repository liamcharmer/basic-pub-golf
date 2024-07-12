import { leaderboard } from "../../plugins/datahandler";

export default defineEventHandler(async (event) => {
  let users = leaderboard();
  return users;
});
