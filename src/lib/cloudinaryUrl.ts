const CLOUD = "dd89enrjz";

export function cld(publicId: string, tr = ""): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${tr}/${publicId}.webp`;
}

export const imgSizes = {
  thumb: "f_webp,q_auto:good,w_400",
  card: "f_webp,q_auto:good,w_800",
  detail: "f_webp,q_auto:good,w_1400",
};

export function buildImageSet(publicId: string) {
  return {
    thumb: cld(publicId, imgSizes.thumb),
    card: cld(publicId, imgSizes.card),
    detail: cld(publicId, imgSizes.detail),
  };
}