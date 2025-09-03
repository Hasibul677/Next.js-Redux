import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Post {
    userId: number,
    id: number;
    title: string;
    body: string;
};

interface PostsState {
    items: Post[];
    loading: boolean;
    error: string | null;
};

const initialState: PostsState = {
    items: [],
    loading: false,
    error: null
};

export const fetchPosts = createAsyncThunk(`posts/fetchPosts`, async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    return (await res.json()) as Post[];
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch posts";
            });
    }
});

export default postsSlice.reducer;