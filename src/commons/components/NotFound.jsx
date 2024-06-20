import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function NotFoundView() {

  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: 'auto',
            display: 'flex',
            minHeight: '100vh',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            Lo sentimos, no se ha encontrado la página.
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 3 }}>
            Lo sentimos, no hemos podido encontrar la página que busca. 
            ¿Quizá ha escrito mal la URL? Asegúrese de revisar su ortografía.
          </Typography>

          <Button size="large" variant="contained" onClick={()=> navigate('/menu', { replace: true })}>
            Ir al menu principal
          </Button>
        </Box>
      </Container>
    </>
  );
}
