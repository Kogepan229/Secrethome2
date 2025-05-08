import ky from "ky";

export const fileApi = ky.create({ prefixUrl: "http://localhost:20080/file-api", retry: 1 });
