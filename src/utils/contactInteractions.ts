export const resolveCopyValue = (rowText: string, datasetValue: string): string => {
  const trimmedRowText = rowText.trim();
  if (trimmedRowText) {
    return trimmedRowText;
  }

  return datasetValue.trim();
};

export const shouldResetSubmitState = (
  successMessage: string | null | undefined,
  errorMessage: string | null | undefined,
): boolean => {
  const hasSuccess = Boolean(successMessage?.trim());
  const hasError = Boolean(errorMessage?.trim());

  return hasSuccess || hasError;
};
