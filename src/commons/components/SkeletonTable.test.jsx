import { render } from '@testing-library/react';
import SkeletonTable from './SkeletonTable';

describe('SkeletonTable Component', () => {
  it('renderiza la cantidad de filas especificada por defecto', () => {
    const { container } = render(<SkeletonTable />);
    // MUI Skeleton renders a span with class MuiSkeleton-root
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(5);
  });

  it('renderiza la cantidad de filas pasadas por prop', () => {
    const { container } = render(<SkeletonTable rows={3} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(3);
  });
});
