import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function NotFoundView() {

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

          <Button href="/" size="large" variant="contained">
            Ir a Inicio
          </Button>
        </Box>
      </Container>
    </>
  );
}
