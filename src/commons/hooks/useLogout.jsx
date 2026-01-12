import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export default function useLogout() {

    const navigate = useNavigate();

    const logout = useCallback((controllerLogout) => {
        sessionStorage.clear();
        navigate('/', { replace: true });
        if (controllerLogout){ // Si se recibe 1 como parametro significa que es un logout controlado
        enqueueSnackbar('Sesión cerrada',{ variant: 'success' });
        } else {
        enqueueSnackbar('Vuelva a iniciar sesión',{ variant: 'warning' });
        }
    }, [navigate]);

    return { logout };
}
