import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Theme, ThemePanel } from "@radix-ui/themes";
// CSS
import "@radix-ui/themes/styles.css";
// Layouts
import { RootLayout } from "./layouts/root";
import { AppLayout } from "./layouts/app";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Theme>
        <RootLayout>
          <ThemePanel />
          <AppLayout />
        </RootLayout>
      </Theme>
    </ApolloProvider>
  </React.StrictMode>
);
