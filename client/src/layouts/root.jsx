import { Outlet } from "react-router-dom";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { Box, Container, Flex } from "@radix-ui/themes";

import { Header } from "./components/header";
import { Footer } from "./components/footer";

export const RootLayout = () => {
  return (
    <Theme accentColor='tomato' grayColor='sand' panelBackground='translucent'>
      <Box height={{ md: "100svh" }} maxWidth={{ md: "100svw" }}>
        <ThemePanel />

        <Container size={"4"}>
          <Header />
          <Outlet />
          <Footer />
        </Container>
        <Flex as='footer' align={"center"} height={"100px"} padding={"0 20px"} gap={"20px"}></Flex>
      </Box>
    </Theme>
  );
};
