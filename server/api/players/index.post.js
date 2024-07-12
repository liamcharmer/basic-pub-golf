import { submitUser } from "../../plugins/datahandler";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let user = submitUser(body);
  return user;
});
