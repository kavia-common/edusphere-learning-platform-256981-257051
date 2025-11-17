import { render, screen } from "@testing-library/react";
import App from "../App";

test("skip to content link is present", async () => {
  render(<App />);
  const skip = await screen.findByText(/Skip to content/i);
  expect(skip).toBeInTheDocument();
});
