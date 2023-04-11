import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MyForm from './MyForm';

const mockOptions = ['Option 1', 'Option 2', 'Option 3'];

const reducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'OPTION_SELECTED':
      return { ...state, selectedOption: action.payload.selectedOption };
    default:
      return state;
  }
};

const renderWithRedux = (
  ui: JSX.Element,
  { initialState, store = createStore(reducer, initialState) }: any = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe('MyForm', () => {
  it('renders the form with options', () => {
    renderWithRedux(<MyForm options={mockOptions} />);
    const selectElement = screen.getByLabelText(/select an option/i);
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.children.length).toEqual(mockOptions.length);
  });

  it('dispatches the selected option to Redux on submit', () => {
    const { store } = renderWithRedux(<MyForm options={mockOptions} />);
    const selectElement = screen.getByLabelText(/select an option/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.selectOptions(selectElement, mockOptions[1]);
    userEvent.click(submitButton);

    const state = store.getState();
    expect(state.selectedOption).toEqual(mockOptions[1]);
  });
});
