import { Stack, Skeleton } from '@mui/material';

export default function SkeletonTable({ rows = 5 }) { // Por defecto se generan 5 filas
  return (
    <Stack spacing={0.25}>{
        /* Array.from crea un array de n elementos para poder iterar. */}
        {Array.from({ length: rows }).map((_, index) => {
            const rowHeight = index === 0 ? '40px' : '50px';
            
            return (
                <Skeleton 
                    key={index}
                    variant="rectangular" 
                    animation="wave"
                    height={rowHeight} 
                />
            );
        })}
    </Stack>
  )
}
