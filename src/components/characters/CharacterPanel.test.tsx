import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CharacterPanel from "./CharacterPanel";
import "@testing-library/jest-dom";

jest.mock("next/image", () => (props: any) => <img {...props} />);

// --- Redux simple ---
const mockDispatch = jest.fn();
let mockFavIds: number[] = [];

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockFavIds,
}));

// --- Actions del slice (simples) ---
const mockLoadFavorites = jest.fn(() => ({ type: "favorites/loadFavorites" }));
const mockToggleFavorite = jest.fn((payload) => ({ type: "favorites/toggleFavorite", payload }));

jest.mock("@/store/slices/favoritesSlice", () => ({
  loadFavorites: () => mockLoadFavorites(),
  toggleFavorite: (payload: any) => mockToggleFavorite(payload),
  selectFavIds: () => mockFavIds,
}));

// --- Componente Hijo simplificado ---
jest.mock("./CharacterDetail", () => (props: any) => (
  <div data-testid="CharacterDetail">Detail: {props.character?.name}</div>
));

// CharacterList: input de búsqueda + botón para probar toggle-fav
jest.mock("./CharacterList", () => (props: any) => (
  <div data-testid="CharacterList">
    <div>items:{props.items?.length ?? 0}</div>
    <input
      aria-label="search"
      value={props.query}
      onChange={(e) => props.onQueryChange(e.target.value)}
    />
    <button onClick={() => props.onToggleFavorite(999, true)}>toggle-fav</button>
  </div>
));

// util fetch ok
const makeFetchOk = (data: any) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as Response);

describe("CharacterPanel (simple)", () => {
  const RICK = {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    gender: "Male",
    origin: "Earth",
    location: "Earth",
    episodes: 10,
    imageLarge: "/rick.png",
  };
  const MORTY = {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    gender: "Male",
    origin: "Earth",
    location: "Earth",
    episodes: 8,
    imageLarge: "/morty.png",
  };

  beforeEach(() => {
    // cada test define su propio fetch
    (global as any).fetch = jest.fn().mockImplementation(() => makeFetchOk([RICK, MORTY]));
    mockDispatch.mockReset();
    mockLoadFavorites.mockClear();
    mockToggleFavorite.mockClear();
    mockFavIds = [];
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore?.();
  });

  it("render inicial: Loading → muestra detalle del primer personaje y CharacterList; despacha loadFavorites", async () => {
    render(<CharacterPanel />);

    expect(screen.getByText(/Loading…/i)).toBeInTheDocument();

    // espera al detalle (cuando termina el fetch)
    expect(await screen.findByTestId("CharacterDetail")).toHaveTextContent("Rick Sanchez");
    expect(await screen.findByTestId("CharacterList")).toBeInTheDocument();
    expect(screen.getByText("items:2")).toBeInTheDocument();

    // loadFavorites despachado
    expect(mockLoadFavorites).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "favorites/loadFavorites" });
  });

  it("límite de favoritos: con 4 ya seleccionados, alerta y NO toggle", async () => {
    mockFavIds = [1, 2, 3, 4]; // ya hay 4

    render(<CharacterPanel />);
    await screen.findByTestId("CharacterDetail"); // espera a que termine primer fetch

    await userEvent.click(screen.getByText("toggle-fav"));

    expect(window.alert).toHaveBeenCalledWith("You can only select up to 4 favorites.");
    expect(mockToggleFavorite).not.toHaveBeenCalled();
  });

  it("error de API: muestra mensaje de error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

    render(<CharacterPanel />);

    // al terminar el ciclo de render aparecerá el mensaje
    expect(await screen.findByText("Error fetching characters")).toBeInTheDocument();
  });

  it("sin resultados: muestra 'No characters found'", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      })
    );

    render(<CharacterPanel />);
    expect(await screen.findByText("No characters found")).toBeInTheDocument();
    expect(screen.getByAltText("Image without results")).toBeInTheDocument();
  });
});
