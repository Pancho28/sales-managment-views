import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from './FormProvider';
import RHFSelect from './RHFSelect';

const TestComponent = ({ onSubmit }) => {
  const methods = useForm({ defaultValues: { selectTest: '' } });
  const values = [{ id: '1', name: 'Opcion 1' }, { id: '2', name: 'Opcion 2' }];
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <RHFSelect name="selectTest" label="Seleccione" values={values} />
      <button type="submit">Submit</button>
    </FormProvider>
  );
};

describe('RHFSelect', () => {
  it('permite seleccionar una opcion y envia el valor', async () => {
    const mockSubmit = jest.fn();
    render(<TestComponent onSubmit={mockSubmit} />);
    
    // Abrir select
    const select = screen.getByLabelText('Seleccione');
    fireEvent.mouseDown(select);
    
    // Click en la opcion
    fireEvent.click(screen.getByText('Opcion 1'));

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ selectTest: '1' }, expect.anything());
    });
  });
});
