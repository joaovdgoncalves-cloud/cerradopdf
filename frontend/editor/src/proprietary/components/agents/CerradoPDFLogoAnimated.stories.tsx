import type { Meta, StoryObj } from "@storybook/react-vite";
import { CerradoPDFLogoAnimated } from "@app/components/agents/CerradoPDFLogoAnimated";

/**
 * Animated CerradoPDF logo mark, used as a "thinking" indicator in the chat panel.
 */
const meta: Meta<typeof CerradoPDFLogoAnimated> = {
  title: "Agents/CerradoPDFLogoAnimated",
  component: CerradoPDFLogoAnimated,
  parameters: { layout: "padded" },
  args: {
    size: 20,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 64 },
};
