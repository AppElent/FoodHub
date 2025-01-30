import { Box, Button, Stack, TextField, TextFieldProps } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';

const JsonTextField = (props: TextFieldProps) => {
  const formik = useFormikContext();
  const [value, setValue] = useState<string>(JSON.stringify(formik.values, null, 2));
  return (
    <Stack spacing={2}>
      <TextField
        label="JSON"
        multiline={true}
        minRows={10}
        fullWidth={true}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        InputProps={{
          style: { fontFamily: 'monospace', whiteSpace: 'pre-wrap' }, // Monospace font & proper line breaks
        }}
        value={value}
        {...props}
      />
      <Box sx={{ justifyContent: 'flex-end', display: 'flex' }}>
        <Button onClick={() => setValue(JSON.stringify(formik.values, null, 2))}>Reset</Button>
        <Button
          variant="contained"
          onClick={() => {
            try {
              formik.setValues(JSON.parse(value));
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Set
        </Button>
      </Box>
    </Stack>
  );
};

export default JsonTextField;
