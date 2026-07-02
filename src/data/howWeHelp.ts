import rcanAndPdsStaffImage from "../assets/rcan_and_pds_staff.jpeg";
import bagOfGiftsImage from "../assets/bag-of-gifts.jpg";
import beautyBehindBarsImage from "../assets/beauty-behind-bars.jpg";
import paintingImage from "../assets/painting.jpg";
import bikeGiftsImage from "../assets/bike-gifts.jpg";
import bikeBagsGiftImage from "../assets/bike-bags-gift.jpg";
import bikeDonationImage from "../assets/bike-donation.jpeg";
import mrrogersBikeImage from "../assets/mrrogersbike.jpg";

export { rcanAndPdsStaffImage };

export const pathwaySteps = [
  {
    label: "1. Request received",
    body: "RCAN receives a specific short-term need through the DC Public Defender Service. All individuals are people PDS represents or has previously represented.",
  },
  {
    label: "2. Network mobilizes",
    body: "RCAN shares information with the full network. Each congregation determines whether it is able to help with a particular request — then coordinates volunteers, resources, or funding.",
  },
  {
    label: "3. Stabilization",
    body: "Immediate barriers are reduced so individuals can focus on longer-term reentry goals — housing, employment, and community.",
  },
] as const;

export const prisonFriendsDo = [
  {
    icon: "check",
    text: "Learn about the background and current situation of the person they are matched with",
  },
  {
    icon: "check",
    text: "Build a relationship through letters and reading materials",
  },
  {
    icon: "check",
    text: "Give gifts on special occasions to the person's commissary account — providing access to food, drinks, toiletries, and personal items",
  },
  {
    icon: "check",
    text: "Provide assistance in any other mutually agreed-upon way as the relationship develops",
  },
  {
    icon: "check",
    text: "A single committed person can be just as meaningful as a group.",
  },
] as const;

export const bikeSlides = [
  {
    src: bikeDonationImage,
    class: "object-contain",
    alt: "A donated bicycle being prepared for restoration by Manuel Vera.",
  },
  {
    src: mrrogersBikeImage,
    class: "object-contain",
    alt: "Manuel Vera with a restored bicycle ready for a new rider.",
  },
] as const;

export const beautySlides = [
  {
    src: beautyBehindBarsImage,
    class: "object-cover object-top",
    alt: "PDS staff, RCAN volunteers, and recently returned clients show their artwork at the Beauty Behind Bars event at St. Columba's Episcopal Church.",
  },
  {
    src: paintingImage,
    alt: "A recently returned PDS client stands beside his large mural on display at the Beauty Behind Bars exhibition.",
  },
] as const;

export const holidaySlides = [
  {
    src: bagOfGiftsImage,
    alt: "Holiday gift bags prepared for detained youth at the Youth Services Center.",
    quality: 70,
  },
  {
    src: bikeGiftsImage,
    alt: "A restored bicycle prepared for delivery to a returning citizen.",
  },
  {
    src: bikeBagsGiftImage,
    alt: "A restored bicycle displayed with gift bags prepared by RCAN supporters.",
  },
] as const;
