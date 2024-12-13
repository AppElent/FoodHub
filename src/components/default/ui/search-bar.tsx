import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  onClear: () => void;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  props?: Partial<React.ComponentProps<typeof OutlinedInput>>;
}

const SearchBar = ({ onClear, value, onChange, placeholder, props }: SearchBarProps) => {
  return (
    <OutlinedInput
      placeholder={placeholder}
      // startAdornment={
      //   <InputAdornment position="start">
      //     <SvgIcon>{/* <SearchMdIcon /> */}</SvgIcon>
      //   </InputAdornment>
      // }
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="clear"
            onClick={onClear}
            onMouseDown={(e) => e.preventDefault()}
            edge="end"
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      }
      autoFocus
      value={value || ''}
      sx={{ flexGrow: 1 }}
      onChange={onChange}
      {...props}
    />
  );
};

export default SearchBar;
