import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PropsWithChildren, useState } from "react";

export interface GenericRowPopoverActionProps {
  title: string;
  onClick: () => void;
  icon: JSX.Element;
  className?: string;
}
interface GenericRowPopoverProps extends PropsWithChildren {
  actions: GenericRowPopoverActionProps[];
  isModal?: boolean;
}

const GenericRowPopover = (props: GenericRowPopoverProps): JSX.Element => {
  const [isVisible, setVisiblility] = useState(false);
  const { children, actions, isModal } = props;

  return (
    <Popover
      modal={isModal}
      open={isVisible}
      onOpenChange={(value) => setVisiblility(value)}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="app-popover-container">
        {actions.map(({ icon, onClick, title, className }, key) => (
          <button
            type="button"
            key={key}
            onClick={() => {
              onClick();
              setVisiblility(false);
            }}
            className={`app-popover-button ${className ? className : ""}`}
          >
            <span className="text-base">{icon}</span>
            <span>{title}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default GenericRowPopover;
