import React, { ReactNode } from "react";
import { Grid, GridProps } from "@mui/material";

interface GridContainerProps extends GridProps {
  children: ReactNode;
}

const GridContainer: React.FC<GridContainerProps> = ({ children, ...props }) => (
  <Grid container spacing={2} {...props}>
    {children}
  </Grid>
);

export default GridContainer;
