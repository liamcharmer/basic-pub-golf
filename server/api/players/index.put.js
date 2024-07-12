import { updateUser } from "../../plugins/datahandler";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let user = updateUser(body);
  return user;
});
