import { IonButton } from '@ionic/react';
import { ComponentProps } from 'react';
import { FieldValues, FormState } from 'react-hook-form';

export const SubmitButton = <T extends FieldValues>({
  formState,
  disabled,
  ...props
}: ComponentProps<typeof IonButton> & {
  formState: FormState<T>;
}) => {
  const { isSubmitting, isDirty, isValid } = formState;

  return (
    <IonButton
      expand="block"
      type="submit"
      disabled={isSubmitting || !isDirty || !isValid || disabled}
      {...props}
    />
  );
};
