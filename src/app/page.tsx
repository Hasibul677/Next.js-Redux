"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/features/postsSlice";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch])
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Posts (Dummy API)</h1>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer"
        onClick={() =>
          dispatch(
            createPost({
              userId: 1,
              title: "New Post",
              body: "This is a new post created in Redux!",
            })
          )
        }
      >
        ➕ Add Post
      </button>
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full ">
        {items.map((post) => (
          <li
            key={post.id}
            className="bg-white shadow p-4 rounded hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.body}</p>
             <div className="flex justify-end gap-2 mt-2">
              <button
                className="bg-yellow-400 text-black px-3 py-1 rounded cursor-pointer"
                onClick={() =>
                  dispatch(
                    updatePost({ ...post, title: post.title + " (Updated)" })
                  )
                }
              >
                ✏️ Update
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                onClick={() => dispatch(deletePost(post.id))}
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
