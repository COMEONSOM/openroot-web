import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";
import { HelmetProvider } from "react-helmet-async"; // ✅ FIX

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    expect(container).toBeTruthy(); // ✅ safer check
  });
});