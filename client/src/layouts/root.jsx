import PropTypes from "prop-types";

import { Header } from "./components/header";
import { Footer } from "./components/footer";

export const RootLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
