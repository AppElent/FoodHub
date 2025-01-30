import { TextField, TextFieldProps } from '@mui/material';
import { FormikProps } from 'formik';

type FormTextFieldProps = TextFieldProps & {
  formik: FormikProps<any>;
};

const FormTextField = (props: FormTextFieldProps) => {
  const { formik, id, name, label, type, ...rest } = props;
  return (
    <TextField
      id={id}
      name={name}
      label={label}
      type={type}
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.password && Boolean(formik.errors.password)}
      helperText={
        formik.touched.password && typeof formik.errors.password === 'string'
          ? formik.errors.password
          : undefined
      }
      {...rest}
    />
  );
};

export default FormTextField;
