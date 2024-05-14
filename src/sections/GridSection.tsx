import React from "react";
import { Grid } from "@mui/material";
import CustomPaper from "./CustomPaper";
import { Theme } from "@mui/material/styles";

interface GridSectionProps {
  xs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  children: React.ReactNode;
  fullheight?: boolean;
  padding?: number;
  backgroundColor?: string;
  theme: Theme; // Add theme prop
}

const GridSection: React.FC<GridSectionProps> = ({ xs, md, lg, children, fullheight, padding, backgroundColor, theme }) => (
  <Grid item xs={xs} md={md} lg={lg}>
    <CustomPaper theme={theme} fullheight={fullheight} padding={padding || 0} backgroundColor={backgroundColor}>
      {children}
    </CustomPaper>
  </Grid>
);

export default GridSection;
