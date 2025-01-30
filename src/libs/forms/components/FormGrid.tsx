import { Grid2 as Grid, Grid2Props } from '@mui/material';
import { FieldConfig } from '..';
import TextField from './TextField';

type ItemProps = Grid2Props & {
  fieldDefinition: FieldConfig;
};

interface FormGridProps {
  items: ItemProps[];
}

const FormGrid = (props: FormGridProps) => {
  return (
    <Grid
      container
      spacing={2}
    >
      {props.items.map((item, index) => {
        const { fieldDefinition, ...gridProps } = item;
        return (
          <Grid
            key={index}
            {...gridProps}
          >
            <TextField
              field={fieldDefinition}
              muiTextFieldProps={{ fullWidth: true }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default FormGrid;
