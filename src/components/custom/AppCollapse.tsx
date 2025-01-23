import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  isVisible: boolean;
  className?: string;
}

const AppCollapse = ({
  isVisible,
  children,
  className,
}: Props): JSX.Element => {
  return (
    <div
      className={`app-collapse ${
        isVisible ? "app-collapse-open" : "app-collapse-close"
      }`}
    >
      <div className={`overflow-hidden ${className}`}>{children}</div>
    </div>
  );
};

export default AppCollapse;

export const AppHorizontalCollapse = ({
  isVisible,
  children,
  className,
}: Props): JSX.Element => {
  return (
    <div
      className={`app-horizontal-collapse ${
        isVisible
          ? "app-horizontal-collapse-open"
          : "app-horizontal-collapse-close"
      }`}
    >
      <div className={`overflow-hidden ${className}`}>{children}</div>
    </div>
  );
};
