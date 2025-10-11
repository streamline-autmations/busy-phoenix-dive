// If url is a Cloudinary asset (has /upload/), inject transforms; else return as-is.
export const transformImg = (url: string, t: string) =>
  url && url.includes("/upload/") ? url.replace("/upload/", `/upload/${t}/`) : url;

export const cardImg = (u: string) => transformImg(u, "f_auto,q_auto,w_400,h_400,c_fill,g_auto");
export const galleryImg = (u: string) => transformImg(u, "f_auto,q_auto,w_1200");