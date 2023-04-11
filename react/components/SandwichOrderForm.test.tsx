import React from "react";
import { render, screen, waitFor, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MyForm from "./MyForm";
import { optionSelected } from "./redux/optionsSlice";

const server = setupServer(
  rest.get("/sandwiches", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "sandwich 1",
        },
        {
          name: "sandwich 2",
        },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

interface RenderWithProvidersOptions extends RenderOptions {
  store?: any;
  queryClient?: any;
}

const renderWithProviders = (
  ui: React.ReactElement,
  {
    store = configureStore({
      reducer: {
        options: jest.fn(),
      },
    }),
    queryClient = new QueryClient(),
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) => {
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </Provider>,
    renderOptions
  );
};

describe("MyForm", () => {
  it("renders the form correctly", async () => {
    renderWithProviders(<MyForm />);

    await waitFor(() =>
      expect(screen.getByText("Select an option:")).toBeInTheDocument()
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders an error message if sandwiches cannot be fetched", async () => {
    server.use(
      rest.get("/sandwiches", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderWithProviders(<MyForm />);

    await waitFor(() =>
      expect(screen.getByText("Error fetching sandwiches")).toBeInTheDocument()
    );
  });

  it("dispatches the selected option on form submission", async () => {
    const selectedOption = "sandwich 1";
    renderWithProviders(<MyForm />);

    await waitFor(() =>
      expect(screen.getByText("Select an option:")).toBeInTheDocument()
    );
    const select = screen.getByRole("combobox");
    userEvent.selectOptions(select, selectedOption);
    userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(store.getActions()).toContainEqual(
        optionSelected({ selectedOption })
      )
    );
  });
});
