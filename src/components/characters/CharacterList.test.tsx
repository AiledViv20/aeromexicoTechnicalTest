import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CharacterList from "./CharacterList";

// Mock de next/image (evita props como fill/priority)
jest.mock("next/image", () => {
  return function MockedImage(props: any) {
    const { src, alt, width, height } = props;
    // también aceptamos className pero no la usamos
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

const makeChar = (id: number, name: string) => ({
  id,
  name,
  status: "Alive" as const,
  species: "Human",
  gender: "Male" as const,
  origin: "Earth",
  location: "Earth",
  episodes: 1,
  imageLarge: `/c${id}.png`,
});

const ITEMS = [
  makeChar(1, "Rick Sanchez"),
  makeChar(2, "Morty Smith"),
  makeChar(3, "Summer Smith"),
  makeChar(4, "Beth Smith"),
  makeChar(5, "Jerry Smith"),
];

describe("CharacterList (simple)", () => {
  const setup = (overrides: Partial<React.ComponentProps<typeof CharacterList>> = {}) => {
    const onQueryChange = jest.fn();
    const onSelect = jest.fn();
    const onToggleFavorite = jest.fn();

    const props: React.ComponentProps<typeof CharacterList> = {
      items: ITEMS,
      allItemsForFavs: ITEMS,
      query: "", // input controlado por el padre → no cambia solo
      onQueryChange,
      selectedId: -1,
      onSelect,
      pageSize: 2, // forzamos paginación simple
      onToggleFavorite,
      favIds: [],
      maxFavs: 4,
      ...overrides,
    };

    const utils = render(<CharacterList {...props} />);
    return { ...utils, props, onQueryChange, onSelect, onToggleFavorite };
  };

  it("renderiza primera página y controla paginación", async () => {
    setup();

    // Primera página (2 items): Rick y Morty (solo primer nombre)
    expect(screen.getByText("Rick")).toBeInTheDocument();
    expect(screen.getByText("Morty")).toBeInTheDocument();
    expect(screen.queryByText("Summer")).not.toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: "Previous" });
    const nextBtn = screen.getByRole("button", { name: "Next" });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    await userEvent.click(nextBtn);
    expect(screen.getByText("Summer")).toBeInTheDocument();
    expect(screen.getByText("Beth")).toBeInTheDocument();
    expect(prevBtn).toBeEnabled();

    await userEvent.click(nextBtn);
    expect(screen.getByText("Jerry")).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();
  });

  it("buscar dispara onQueryChange (una llamada por tecla)", async () => {
    const { onQueryChange } = setup();
    const input = screen.getByLabelText("Search characters");

    await userEvent.type(input, "mor");

    // Se llama 3 veces (m, o, r) porque query no cambia en el test
    expect(onQueryChange).toHaveBeenCalledTimes(3);
    const args = onQueryChange.mock.calls.map((c) => c[0]).join("");
    expect(args).toBe("mor");
  });

  it("clic en card llama onSelect con el id", async () => {
    const { onSelect } = setup();
    await userEvent.click(screen.getByText("Rick")); // primer nombre visible en la card
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("favorito deshabilitado cuando ya alcanzó maxFavs", async () => {
    const favIds = [2, 3, 4, 5]; // ya hay 4, Rick no es fav
    const { onToggleFavorite } = setup({ favIds, maxFavs: 4 });

    // botón de like de Rick (primera card visible): "Add to favorites"
    const likeBtn = screen.getAllByRole("button", { name: /Add to favorites/i })[0];
    expect(likeBtn).toBeDisabled();

    await userEvent.click(likeBtn);
    expect(onToggleFavorite).not.toHaveBeenCalled();
  });

  it("favorito permitido llama onToggleFavorite(id, true)", async () => {
    const favIds = [2]; // Morty es fav, Rick no
    const { onToggleFavorite } = setup({ favIds, maxFavs: 4 });

    const likeBtnAdd = screen.getByRole("button", { name: /Add to favorites/i });
    expect(likeBtnAdd).toBeEnabled();

    await userEvent.click(likeBtnAdd);
    expect(onToggleFavorite).toHaveBeenCalledWith(1, true);
  });

  it("panel FAVS: abre, elimina y selecciona un favorito", async () => {
    const favIds = [1, 2]; // Rick y Morty
    const { onToggleFavorite, onSelect } = setup({ favIds });

    await userEvent.click(screen.getByRole("button", { name: /FAVS/i }));

    const dialog = screen.getByRole("dialog", { name: "Favorites" });
    const inDialog = within(dialog);

    // Nombres dentro del panel (evita colisiones con la grid)
    expect(inDialog.getByText("Rick")).toBeInTheDocument();
    expect(inDialog.getByText("Morty")).toBeInTheDocument();

    // Eliminar Rick
    const removeRickBtn = inDialog.getByRole("button", { name: /Remove Rick from favorites/i });
    await userEvent.click(removeRickBtn);
    expect(onToggleFavorite).toHaveBeenCalledWith(1, false);

    // Seleccionar Morty desde el panel
    await userEvent.click(inDialog.getByText("Morty"));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
