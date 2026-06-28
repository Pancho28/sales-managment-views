import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from './FormProvider';

const TestComponent = ({ onSubmit }) => {
  const methods = useForm();
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <div data-testid="child">Hijo</div>
      <button type="submit">Submit</button>
    </FormProvider>
  );
};

describe('FormProvider', () => {
  it('renderiza los hijos', () => {
    render(<TestComponent onSubmit={jest.fn()} />);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
