declare module "jstat" {
  export const chisquare: {
    pdf: (x: number, df: number) => number;
    inv: (p: number, df: number) => number;
  };
}
