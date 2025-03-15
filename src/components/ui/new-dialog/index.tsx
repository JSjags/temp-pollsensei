import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

type RootProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root> & {
  nested?: boolean;
};

const Root = (props: RootProps) => {
  const { nested = false, ...rootProps } = props;
  const isMobile = useMediaQuery("(max-width: 440px)");
  const DrawerRoot = nested ? Drawer.NestedRoot : Drawer.Root;
  const RootWrapper = isMobile ? DrawerRoot : DialogPrimitive.Root;
  return <RootWrapper {...rootProps} />;
};

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof DialogPrimitive.Trigger>;
type TriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const { asChild = true, ...triggerProps } = props;
  const isMobile = useMediaQuery("(max-width: 440px)");
  const TriggerWrapper = isMobile ? Drawer.Trigger : DialogPrimitive.Trigger;
  return <TriggerWrapper asChild={asChild} {...triggerProps} ref={ref} />;
});

Trigger.displayName = "DialogTrigger";

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

type PortalProps = {
  children: React.ReactNode;
  position?: "absolute" | "fixed";
};

function DialogPortal({ children, position }: PortalProps) {
  if (position === "fixed") {
    return <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>;
  }
  return children;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 backdrop-blur-md bg-[#8D8D8D4D] z-[10000000000] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof DialogPrimitive.Content>;
type ContentProps = Omit<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  "onAnimationEnd"
> & {
  position?: "absolute" | "fixed";
  overlayClassName?: string;
  buttonClassName?: string;
};

const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const isMobile = useMediaQuery("(max-width: 440px)");
  return isMobile ? (
    <DrawerContent {...props} ref={ref} />
  ) : (
    <DialogContent {...props} ref={ref} />
  );
});

Content.displayName = "DialogContent";

const DialogContent = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const {
    className,
    position = "fixed",
    overlayClassName,
    buttonClassName,
    children,
    ...contentProps
  } = props;
  return (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.body.style.pointerEvents = "";
        }}
        {...contentProps}
        ref={ref}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className={cn("size-6", buttonClassName)} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

DialogContent.displayName = "DialogContent";

type DrawerContentElement = ElementRef<typeof Drawer.Content>;
type DrawerContentProps = ComponentPropsWithoutRef<typeof Drawer.Content>;

const DrawerContent = forwardRef<DrawerContentElement, DrawerContentProps>(
  (props, ref) => {
    const { className, ...contentProps } = props;
    return (
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 backdrop-blur-md bg-[#8D8D8D4D] z-[100]" />
        <Drawer.Content
          className={cn(
            "bg-background flex flex-col rounded-t-[20px] max-h-[96%] h-full fixed bottom-0 left-0 right-0 border border-new-elements-border z-[100]",
            "card-gradient",
            className
          )}
          {...contentProps}
          onOpenAutoFocus={(event) => {
            contentProps.onOpenAutoFocus?.(event);
            event.preventDefault();
          }}
          ref={ref}
        />
      </Drawer.Portal>
    );
  }
);

DrawerContent.displayName = "DialogContent";

/* -------------------------------------------------------------------------------------------------
 * Body
 * -----------------------------------------------------------------------------------------------*/

type DialogBodyElement = React.ElementRef<"div">;
type DialogBodyProps = Omit<React.ComponentPropsWithoutRef<"div">, "dir">;

const DialogBody = React.forwardRef<DialogBodyElement, DialogBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-auto p-4", className)}
        {...props}
      />
    );
  }
);

DialogBody.displayName = "DialogBody";

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

type HeaderElement = ElementRef<"div">;
type HeaderProps = ComponentPropsWithoutRef<"div"> & {
  icon?: ReactNode;
};

const Header = forwardRef<HeaderElement, HeaderProps>((props, ref) => {
  const { className, icon, children, ...headerProps } = props;
  return (
    <div
      className={cn(
        "p-4 md:p-5 border-b border-new-elements-border flex items-center gap-3.5",
        className
      )}
      {...headerProps}
      ref={ref}
    >
      {icon && (
        <div className="size-10 shrink-0 rounded-full border border-new-elements-border flex justify-center items-center text-new-muted-foreground">
          {icon}
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
});

Header.displayName = "DialogHeader";

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/

type FooterElement = ElementRef<"div">;
type FooterProps = ComponentPropsWithoutRef<"div">;

const Footer = forwardRef<FooterElement, FooterProps>((props, ref) => {
  const { className, ...footerProps } = props;
  return (
    <div
      className={cn(
        "py-4 px-5 border-t border-new-elements-border flex gap-3 justify-end",
        className
      )}
      {...footerProps}
      ref={ref}
    />
  );
});

Footer.displayName = "DialogFooter";

/* -------------------------------------------------------------------------------------------------
 * Title
 * -----------------------------------------------------------------------------------------------*/

type TitleElement = ElementRef<typeof DialogPrimitive.Title>;
type TitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

const Title = forwardRef<TitleElement, TitleProps>((props, ref) => {
  const isMobile = useMediaQuery("(max-width: 440px)");
  const TitleWrapper = isMobile ? Drawer.Title : DialogPrimitive.Title;
  return (
    <p className="text-new-foreground font-medium">
      <TitleWrapper {...props} ref={ref} />
    </p>
  );
});

Title.displayName = "DialogTitle";

/* -------------------------------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------------------------*/

type DescriptionElement = ElementRef<typeof DialogPrimitive.Description>;
type DescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

const Description = forwardRef<DescriptionElement, DescriptionProps>(
  (props, ref) => {
    const { className, ...descriptionProps } = props;
    const isMobile = useMediaQuery("(max-width: 440px)");
    const DescriptionWrapper = isMobile
      ? Drawer.Description
      : DialogPrimitive.Description;

    return (
      <p className={cn("text-sm font-medium", className)}>
        <DescriptionWrapper {...descriptionProps} ref={ref} />
      </p>
    );
  }
);

Description.displayName = "DialogDescription";

export const Dialog = {
  Root,
  NestedRoot: Drawer.NestedRoot,
  Trigger,
  Content,
  Header,
  Body: DialogBody,
  Footer,
  Title,
  Description,
  Close: DialogPrimitive.Close,
};
