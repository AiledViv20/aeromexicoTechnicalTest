// CharacterDetail.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import CharacterDetail from "./CharacterDetail";
import "@testing-library/jest-dom";

// Mock de next/image que ignora props no válidos (fill, priority, etc.)
jest.mock("next/image", () => {
  return function MockedImage(props: any) {
    const { src, alt, width, height } = props;
    // devolvemos un <img> limpio sin props booleanos de next/image
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

const baseCharacter = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive" as const,
  species: "Human",
  gender: "Male" as const,
  origin: "Earth",
  location: "Earth",
  episodes: 10,
  imageLarge: "/rick.png",
};

describe("CharacterDetail (simple)", () => {
  it("renderiza nombre, especie y metadatos", () => {
    render(<CharacterDetail character={baseCharacter} />);

    // nombre y especie
    expect(screen.getByRole("heading", { name: /Rick Sanchez/i })).toBeInTheDocument();
    expect(screen.getByText("Human")).toBeInTheDocument();

    // labels de metadata
    expect(screen.getByText("Origin")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("Episodes")).toBeInTheDocument();

    // valores (Earth aparece 2 veces: Origin y Location)
    expect(screen.getAllByText("Earth")).toHaveLength(2);
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("muestra el badge correcto según status", () => {
    // Alive -> LIVE
    const { rerender } = render(<CharacterDetail character={baseCharacter} />);
    expect(screen.getByText("LIVE")).toBeInTheDocument();

    // Dead
    rerender(<CharacterDetail character={{ ...baseCharacter, status: "Dead" }} />);
    expect(screen.getByText("Dead")).toBeInTheDocument();

    // unknown
    rerender(<CharacterDetail character={{ ...baseCharacter, status: "unknown" }} />);
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  it("renderiza imágenes con alt correctos", () => {
    render(<CharacterDetail character={baseCharacter} />);

    // imagen principal
    expect(screen.getByAltText("Rick Sanchez")).toBeInTheDocument();

    // icono de estado
    expect(screen.getByAltText("Icon status character")).toBeInTheDocument();
  });
});
