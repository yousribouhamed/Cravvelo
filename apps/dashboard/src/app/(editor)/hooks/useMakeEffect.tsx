import { ComponentBuilder, WebSitePage } from "@/src/types";

export const useMakeEffect = () => {
  // this will chnage the color of the text
  const textColorEffect = ({
    color,
    component,
    page,
  }: {
    color: string;
    component: ComponentBuilder;
    page: WebSitePage;
  }) => {
    const newComponents = page.components.map((item) => {
      if (item.id === component.id) {
        item.style.textColor = color;
      }
    });

    return { ...page, components: newComponents };
  };

  // this will chnage the size of the text
  const textSizeEffect = ({
    size,
    component,
    page,
  }: {
    size: string;
    component: ComponentBuilder;
    page: WebSitePage;
  }) => {
    const newComponents = page.components.map((item) => {
      if (item.id === component.id) {
        item.style.textSize = size;
      }
    });

    return { ...page, components: newComponents };
  };

  // this will chnage the toughness of the text
  const textToughnessEffect = ({
    toughness,
    component,
    page,
  }: {
    toughness: string;
    component: ComponentBuilder;
    page: WebSitePage;
  }) => {
    const newComponents = page.components.map((item) => {
      if (item.id === component.id) {
        item.style.textThoughness = toughness;
      }
    });

    return { ...page, components: newComponents };
  };

  return { textColorEffect, textSizeEffect, textToughnessEffect };
};
