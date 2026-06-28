import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from './FormProvider';
import RHFCheckbox from './RHFCheckbox';

const TestComponent = ({ onSubmit }) => {
  const methods = useForm({ defaultValues: { checkboxTest: false } });
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <RHFCheckbox name="checkboxTest" label="Aceptar" />
      <button type="submit">Submit</button>
    </FormProvider>
  );
};

describe('RHFCheckbox', () => {
  it('permite chequear la caja y envia el valor', async () => {
    const mockSubmit = jest.fn();
    render(<TestComponent onSubmit={mockSubmit} />);
    
    const checkbox = screen.getByLabelText('Aceptar');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ checkboxTest: true }, expect.anything());
    });
  });
});
