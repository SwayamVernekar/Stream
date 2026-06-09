// ─────────────────────────────────────────────────────────
//  Axios Instance — Pre-configured API client
// ─────────────────────────────────────────────────────────

import axios from "axios";

const API = axios.create({
  baseURL: "http://20.244.26.164:5001/api",
});

export default API;
