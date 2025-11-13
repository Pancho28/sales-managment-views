import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export default function useLogout() {
    const navigate = useNavigate();

    const logout = useCallback(() => {
        sessionStorage.clear();
        navigate('/', { replace: true });
        enqueueSnackbar('Vuelva a iniciar sesión',{ variant: 'warning' });
    }, [navigate]);

    return { logout };
}
