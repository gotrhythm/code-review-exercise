import { createSlice } from '@reduxjs/toolkit';

interface SandwichState {
  sdwType: string;
  extras: string[];
}

const initialState: SandwichState = {
  sdwType: '',
  extras: [],
};

export const sandwichSlice = createSlice({
  name: 'sandwich',
  initialState,
  reducers: {
    setSandwichType: (state, action) => {
      state.sdwType = action.payload;
    },
    addExtra: (state, action) => {
      state.extras.push(action.payload);
    },
    removeExtra: (state, action) => {
      state.extras = state.extras.filter((extra) => extra !== action.payload);
    },
  },
});

export const { setSandwichType, addExtra, removeExtra } = sandwichSlice.actions;
export default sandwichSlice.reducer;
