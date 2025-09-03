import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
};

// --- Thunks ---

// Fetch all posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return (await res.json()) as Post[];
});

// Create a new post (fake API call)
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (newPost: Omit<Post, "id">) => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    const data = (await res.json()) as Post;
    // JSONPlaceholder returns an id, but doesn’t save. We'll just append locally.
    return { ...newPost, id: Date.now() } as Post;
  }
);

// Update a post (fake API call)
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost: Post) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedPost),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }
    );
    await res.json();
    return updatedPost;
  }
);

// Delete a post (fake API call)
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: number) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: "DELETE",
    });
    return postId;
  }
);

// --- Slice ---
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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
      })

      // Create
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items.unshift(action.payload); // add new post at the top
      })

      // Update
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;
