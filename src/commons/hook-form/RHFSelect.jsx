import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
  name: PropTypes.string,
  values: PropTypes.array,
};

export default function RHFSelect({ name, values, onChangeCourseCode, defaultValue, label, ...other }) {

  const { control, register } = useFormContext();

  const onChangeSelect = (event) => {
    if (onChangeCourseCode){
      onChangeCourseCode(event.target.dataset.value)
    }
  };

  return (
    <FormControl>
    <Controller
      name={name}
      control={control}
      render={({ field  , fieldState: { error } }) => (
        <>
            <InputLabel>{label}</InputLabel>
            <Select
              fullWidth
              label={label}
              {...field}              
              onChange={onChangeSelect}
              defaultValue={defaultValue}
              error={!!error}
              {...other}
              {...register(name)}
              
            >
            {values.map((value,index) =>(
                <MenuItem key={index} value={value.value} onClick={onChangeSelect}>
                    {value.name}
                </MenuItem>
            ))}
            </Select>
            <FormHelperText error>{error?.message}</FormHelperText>
        </>
      )}
    />
    </FormControl>
  );
}
