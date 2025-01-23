export const apiConstants = Object.freeze({
  // ACCOUNT STATUS
  TUTORIAL_TYPES: {
    WEB_ARTICLES: "web",
    VIDEO_TUTORIALS: "video",
    TEXT_TUTORIALS: "text",
    IMAGE_TUTORIALS: "image",
    LINK_TUTORIALS: "link",
  },
});

export const apiConstantOptions = Object.freeze({
  TUTORIAL_TYPES: [
    {
      value: apiConstants.TUTORIAL_TYPES.WEB_ARTICLES,
      label: "Web article",
    },
    {
      value: apiConstants.TUTORIAL_TYPES.VIDEO_TUTORIALS,
      label: "Video",
    },
    {
      value: apiConstants.TUTORIAL_TYPES.TEXT_TUTORIALS,
      label: "Text tutorial",
    },
  ],
});

export enum TUTORIAL_ENUM {
  web = "web",
  video = "video",
  text = "text",
  image = "image",
  link = "link",
  all = "all",
}

export const queryKeys = Object.freeze({
  TUTORIALS: "getTutorials",
});
