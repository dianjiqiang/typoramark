import { BASE_URL, TIME_OUT } from "./config";
import KeyieRequest from "./request";

export * from "./modules/home";

export const keyieRequest = new KeyieRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

export default keyieRequest;
