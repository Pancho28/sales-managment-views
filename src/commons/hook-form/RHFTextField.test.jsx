import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from './FormProvider';
import RHFTextField from './RHFTextField';

const TestComponent = ({ onSubmit }) => {
  const methods = useForm({ defaultValues: { textTest: '' } });
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <RHFTextField name="textTest" label="Nombre" />
      <button type="submit">Submit</button>
    </FormProvider>
  );
};

describe('RHFTextField', () => {
  it('permite escribir y envia el valor', async () => {
    const mockSubmit = jest.fn();
    render(<TestComponent onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText('Nombre');
    fireEvent.change(input, { target: { value: 'Juan' } });
    expect(input.value).toBe('Juan');

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ textTest: 'Juan' }, expect.anything());
    });
  });
});
