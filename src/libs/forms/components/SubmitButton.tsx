import { useFormButton } from '@/libs/forms';
import { ButtonProps, CircularProgress, Button as DefaultButton } from '@mui/material';
import _ from 'lodash';

const SubmitButton = (props: ButtonProps) => {
  const { formik, options } = useFormButton();
  const { onClick } = props;

  const newProps = _.merge({}, options, props);

  const disabled = formik.isSubmitting || !formik.isValid || !formik.dirty;

  const isLoading = formik.isSubmitting;

  return (
    <>
      <DefaultButton
        //type="submit"
        color="primary"
        variant="contained"
        disabled={disabled}
        onClick={async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          await formik.handleSubmit();
          if (onClick) await onClick(e);
        }}
        // onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        //   formik.handleSubmit();
        //   if (onClick) onClick(e);
        // }}
        {...newProps.muiButtonProps}
        startIcon={
          isLoading ? (
            <CircularProgress
              size={20}
              color="inherit"
            />
          ) : null
        }
      >
        {isLoading ? 'Submitting...' : props.children || 'Submit'}
      </DefaultButton>
    </>
  );
};

export default SubmitButton;
