import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import SandwichOrderForm from './SandwichOrderForm';

const server = setupServer(
  rest.post('https://api.test.example.com/sandwiches', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders SandwichOrderForm and submits data', async () => {
  render(
    <Provider store={store}>
      <SandwichOrderForm />
    </Provider>,
  );

  const customerNameInput = screen.getByLabelText(/Customer Name:/i);
  userEvent.type(customerNameInput, 'John Doe');

  const sandwichTypeSelect = screen.getByLabelText(/Sandwich Type:/i);
  userEvent.selectOptions(sandwichTypeSelect, 'turkey');

  const cheeseCheckbox = screen.getByLabelText(/Cheese/i);
  const tomatoCheckbox = screen.getByLabelText(/Tomato/i);
  fireEvent.click(cheeseCheckbox);
  fireEvent.click(tomatoCheckbox);

  const submitButton = screen.getByRole('button', { name: /Submit Order/i });
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(server.requests().length).toBe(1),
  );

  const request = server.requests()[0];
  expect(request.method).toBe('POST');
  expect(request.url.pathname).toBe('/sandwiches');
  expect(request.body).toEqual({
    customerName: 'John Doe',
    sdwType: 'turkey',
    extras: ['cheese', 'tomato'],
  });
});
