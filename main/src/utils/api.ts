import ky from "ky";

export const api = ky.create({ prefixUrl: "http://localhost:20080/api", retry: 1 });
