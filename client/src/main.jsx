import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// pages
import { About } from "./pages/about";
// CSS
import "@radix-ui/themes/styles.css";
import "./assets/styles.css";
// Layouts
import { RootLayout } from "./layouts/root";
import { AppLayout } from "./layouts/app";

console.log("Vite Server URL:", import.meta.env.VITE_SERVER_URL);

const client = new ApolloClient({
  uri: import.meta.env.VITE_SERVER_URL,
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router}>
        <RootLayout />
      </RouterProvider>
    </ApolloProvider>
  </React.StrictMode>
);
