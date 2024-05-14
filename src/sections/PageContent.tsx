import React, { ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

interface PageContentProps extends BoxProps {
  children: ReactNode;
}

const PageContent: React.FC<PageContentProps> = ({ children, ...props }) => (
  <Box m="20px" {...props}>
    {children}
  </Box>
);

export default PageContent;
