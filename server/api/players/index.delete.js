import { wipeUsers } from "../../plugins/datahandler";

export default defineEventHandler(async (event) => {
  wipeUsers();
  return [];
});
