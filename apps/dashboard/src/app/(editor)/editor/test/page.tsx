"use client";

import type { FC } from "react";
//@ts-ignore
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";
import { useWebSiteEditor } from "../../editor-state";
import React from "react";
import { useImmer } from "use-immer";

interface pageAbdullahProps {}

const defaultColors = [
  {
    id: 1,
    name: "color1",
    default: "#18A2AD",
    hex: null,
    rgb: null,
    active: true,
  },
  {
    id: 2,
    name: "color2",
    default: "#FF3838",
    hex: null,
    rgb: null,
    active: false,
  },
  {
    id: 3,
    name: "color3",
    default: "#152532",
    hex: null,
    rgb: null,
    active: false,
  },
  {
    id: 4,
    name: "color4",
    default: "#2ECC71",
    hex: null,
    rgb: null,
    active: false,
  },
  {
    id: 5,
    name: "color5",
    default: "#e9dd41",
    hex: null,
    rgb: null,
    active: false,
  },
];

const page: FC = ({}) => {
  const [palette, setPalette] = useImmer({
    collection: [...defaultColors],
    activeColorId: defaultColors.find((color) => color.active).id,
    currentColor: defaultColors.find((color) => color.active).default,
  });

  const presetColors = palette.collection.map((color) => color.default);

  const handleChange = (newColor) => {
    // console.log("newColor", newColor);
    // const {
    //   rgb: { r, g, b, a },
    //   hex
    // } = newColor;

    setPalette((draft) => {
      const findColorById = draft.collection.find(
        (color) => color.id === draft.activeColorId
      );

      // findColorById.hex = hex;
      findColorById.rgb = newColor;
      draft.currentColor = newColor;
    });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="bg-[#252525] w-[300px] h-fit rounded-2xl !relative z-40 ">
        <ColorPicker
          value={palette.currentColor}
          onChange={handleChange}
          //   presets={presetColors}
          hideAdvancedSliders={true}
          hideColorGuide={true}
          hideInputType={true}
          hideControls={true}
          hideEyeDrop={true}
        />
      </div>
    </div>
  );
};

export default page;
