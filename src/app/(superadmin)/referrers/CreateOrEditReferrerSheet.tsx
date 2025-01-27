import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { PropsWithChildren, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, handleApiErrors, isValidResponse } from "@/lib/utils";
import { IReferrer, PostReferrer } from "@/types/api/referrals.types";
import { joiSchemas } from "@/utils/shema";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReferrer, postReferrer } from "@/services/api/referrals.api";
import { AxiosResponse } from "axios";
import { GenericApiResponse } from "@/types/api";
import { queryKeys } from "@/services/api/constants.api";

interface Props extends PropsWithChildren {
  isVisible: boolean;
  setVisibility: (value: boolean) => void;
  data?: IReferrer;
  onDone: () => void;
}

const schema = Joi.object<PostReferrer>({
  email: joiSchemas.email,
  name: joiSchemas.name,
});

const CreateOrEditReferrerSheet = (props: Props): JSX.Element => {
  const { isVisible, setVisibility, data, children, onDone } = props;
  const postReferrerAPI = useMutation({ mutationFn: postReferrer });
  const patchReferrerAPI = useMutation({ mutationFn: patchReferrer });
  const isSheetLoading =
    patchReferrerAPI?.isPending || postReferrerAPI?.isPending;
  const isEdit = !!data?._id;
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PostReferrer>({
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    const email = getValues()?.email;

    if (isEdit && data?.email !== email) {
      setValue("email", data?.email);
      setValue("name", data?.name);
    }

    if (!isEdit && !!email) {
      reset();
    }
  }, [isEdit]);

  const onSubmit = handleSubmit(async ({ email, name }) => {
    let response: AxiosResponse<GenericApiResponse, any> | null = null;

    if (isEdit) {
      if (!data?._id) {
        return toast.warning("Invalid id.");
      }
      response = await patchReferrerAPI.mutateAsync({
        id: data?._id,
        value: {
          name: name?.trim(),
        },
      });
    } else {
      response = await postReferrerAPI?.mutateAsync({
        email: email?.toLowerCase()?.trim(),
        name: name?.trim(),
      });
    }

    if (isValidResponse(response)) {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.REFERRERS],
      });
      onDone?.();
      reset();
      setVisibility(false);
      toast.success(
        response?.data?.message ??
          `Referrer ${isEdit ? "edited" : "added"} successfully.`
      );
    } else {
      handleApiErrors(response);
    }
  });

  return (
    <Sheet onOpenChange={(value) => setVisibility(value)} open={isVisible}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="  sm:max-w-[75vw] md:max-w-[55vw] lg:max-w-[45vw] xl:max-w-[35vw] bg-white overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit Referrer" : "Add New Referrer"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="w-full mt-6 flex flex-col gap-y-7">
          <div className="w-full">
            <label htmlFor="name" className="p-1 block font-medium">
              Name
            </label>
            <input
              type="text"
              disabled={isSheetLoading}
              placeholder="Enter name"
              id="name"
              className={cn(
                "auth-input w-full disabled:opacity-70 focus:!border-purple-800 outline-0 transition-all duration-300 focus:ring-focus focus:ring-1 font-sans border  text-foreground placeholder:text-foreground/40"
              )}
              {...register("name")}
            />
            <ErrorMessage message={errors?.name?.message ?? ""} />
          </div>
          <div className="w-full">
            <label htmlFor="email" className="p-1 block font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              disabled={isEdit || isSheetLoading}
              placeholder="Enter email"
              className={cn(
                "auth-input w-full  disabled:opacity-70 focus:!border-purple-800 outline-0  transition-all duration-300 focus:ring-focus focus:ring-1 font-sans border  text-foreground placeholder:text-foreground/40"
              )}
              {...register("email")}
            />
            <ErrorMessage message={errors?.email?.message ?? ""} />
          </div>
          <div className="flex items-center justify-between space-x-4 w-full">
            <button
              disabled={isSheetLoading}
              className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              type="reset"
            >
              Cancel
            </button>

            <button
              disabled={isSheetLoading}
              className="px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300  font-medium text-white bg-gradient-to-r from-purple-600 to-purple-400 rounded-md hover:shadow-lg"
              type="submit"
            >
              {isSheetLoading ? (
                <ClipLoader size={20} />
              ) : (
                `${isEdit ? "Edit" : "Create"}`
              )}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateOrEditReferrerSheet;
