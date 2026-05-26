import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";
import { HelmetProvider } from "react-helmet-async"; 
import { ThemeProvider } from "../context/ThemeContext";

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <HelmetProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </HelmetProvider>
    );

    expect(container).toBeTruthy();
  });
});
