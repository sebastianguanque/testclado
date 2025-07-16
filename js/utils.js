// utils.js

import { paragraphs } from "./constants.js";

export const getRandomParagraph = () => {
  return paragraphs[Math.floor(Math.random() * paragraphs.length)].split(" ");
};

export const isMobileOrTablet = () => {
  return window.innerWidth <= 1024;
};
