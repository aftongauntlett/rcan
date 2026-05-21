export const CONGREGATION_PARTNERSHIP_TOPIC = "Congregation partnership";

export interface CongregationFieldState {
  showField: boolean;
  required: boolean;
  shouldClearInput: boolean;
}

export const getCongregationFieldState = (topicValue: string): CongregationFieldState => {
  const showField = topicValue === CONGREGATION_PARTNERSHIP_TOPIC;

  return {
    showField,
    required: showField,
    shouldClearInput: !showField,
  };
};

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
