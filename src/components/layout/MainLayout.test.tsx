import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainLayout from "./MainLayout";

// Mock de next/image
jest.mock("next/image", () => {
  return function MockedImage(props: any) {
    const { src, alt } = props;
    return <img src={src} alt={alt} />;
  };
});

describe("MainLayout (simple)", () => {
  it("renderiza logo, degradado y children", () => {
    render(
      <MainLayout>
        <p>Contenido de prueba</p>
      </MainLayout>
    );

    // Logo
    expect(screen.getByAltText("Rick and Morty Logo")).toBeInTheDocument();

    // Degradado
    expect(screen.getByAltText("Green Degraded")).toBeInTheDocument();

    // Children
    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });
});
