import { Flex, Link } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <Flex as='header' direction='column' align='end' width='100%'>
      <Flex as='nav' direction='row' gapX='20px'>
        <Link as={NavLink} href='/' className='Link'>
          Home
        </Link>
        <Link as={NavLink} href='/about' className='Link'>
          About
        </Link>
      </Flex>
    </Flex>
  );
};
