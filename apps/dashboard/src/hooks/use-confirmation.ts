import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  useConfirmationContext,
  ConfirmationConfig,
} from "@/src/contexts/confirmation-context";

interface UseConfirmationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> {
  confirmationConfig?: ConfirmationConfig;
}

export const useConfirmation = <
  TData = unknown,
  TError = Error,
  TVariables = void
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseConfirmationOptions<TData, TError, TVariables>
) => {
  const { openConfirmation } = useConfirmationContext();

  const mutation = useMutation({
    mutationFn,
    ...options,
  });

  const mutateWithConfirmation = (
    variables: TVariables,
    config?: ConfirmationConfig
  ) => {
    const confirmationConfig = config || options?.confirmationConfig || {};

    openConfirmation(confirmationConfig, () => {
      mutation.mutate(variables);
    });
  };

  const mutateAsyncWithConfirmation = (
    variables: TVariables,
    config?: ConfirmationConfig
  ): Promise<TData> => {
    return new Promise((resolve, reject) => {
      const confirmationConfig = config || options?.confirmationConfig || {};

      openConfirmation(confirmationConfig, () => {
        mutation.mutateAsync(variables).then(resolve).catch(reject);
      });
    });
  };

  return {
    ...mutation,
    mutateWithConfirmation,
    mutateAsyncWithConfirmation,
  };
};
