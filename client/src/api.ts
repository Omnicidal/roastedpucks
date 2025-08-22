import axios from "axios";
import type { Entry } from "./types";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export default {
  list: (): Promise<Pick<Entry, "id" | "name" | "pucks">[]> =>
    api.get("/entries").then((r) => r.data),
  get: (id: string): Promise<Entry> =>
    api.get(`/entries/${id}`).then((r) => r.data),
  create: (payload: Entry): Promise<Entry> =>
    api.post("/entries", payload).then((r) => r.data),
  update: (id: string, payload: Omit<Entry, "id">): Promise<Entry> =>
    api.put(`/entries/${id}`, payload).then((r) => r.data),
  remove: (id: string): Promise<void> =>
    api.delete(`/entries/${id}`).then(() => {}),
};
