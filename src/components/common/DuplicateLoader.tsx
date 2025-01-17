import { Fragment } from "react/jsx-runtime";

interface Props {
  loader: React.ReactNode;
  number?: number;
}
const DuplicateLoader = ({ loader, number = 5 }: Props): JSX.Element => {
  return (
    <>
      {[...Array(Math.max(1, number))].map((_, key) => (
        <Fragment key={key}>{loader}</Fragment>
      ))}
    </>
  );
};

export default DuplicateLoader;
