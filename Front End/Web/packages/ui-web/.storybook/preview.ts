import type { Preview } from "@storybook/react-vite";
import "../styles.css";
import "../src/story.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { test: "error" },
    layout: "padded",
  },
};

export default preview;
