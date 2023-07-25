import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchItems, addItem, updateItem, deleteItem } from "./cartAPI";

const initialState = {
  items: [],
  status: "idle",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchAsync = createAsyncThunk("cart/fetchItems", async () => {
  const response = await fetchItems();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const addAsync = createAsyncThunk("cart/addItem", async (item) => {
  const { id, title, brand, thumbnail, price } = item;
  const response = await addItem({
    id,
    title,
    brand,
    thumbnail,
    price,
    quantity: 1,
  });
  return response.data;
});

export const deleteAsync = createAsyncThunk("cart/deleteItem", async (id) => {
  await deleteItem(id);
  return id;
});

export const updateAsync = createAsyncThunk(
  "cart/updateItem",
  async ({ id, change }) => {
    const response = await updateItem(id, change);
    return response.data;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      // fetchAsync
      .addCase(fetchAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchAsync.rejected, (state) => {
        state.status = "failed";
      })

      // addAsync
      .addCase(addAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.items.push(action.payload);
      })
      .addCase(addAsync.rejected, (state) => {
        state.status = "failed";
      })

      // deleteAsync
      .addCase(deleteAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === action.payload
        );
        state.items.splice(index, 1);
      })
      .addCase(deleteAsync.rejected, (state) => {
        state.status = "failed";
      })

      // updateAsync
      .addCase(updateAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items.splice(index, 1, action.payload);
      })
      .addCase(updateAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// export const {  } = cartSlice.actions;

export default cartSlice.reducer;