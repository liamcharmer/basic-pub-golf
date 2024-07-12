import { getUser } from "../../plugins/datahandler";
export default defineEventHandler(async (event) => {
  if (event.context.params.code) {
    return getUser(event.context.params.code);
  }
  return null;
});
