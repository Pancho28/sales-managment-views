import { useMutation } from "@tanstack/react-query";
import { resetPassword } from '../services/admin.js';
import { enqueueSnackbar } from 'notistack';
import useLogout from "../../commons/hooks/useLogout.jsx";

export default function useUserResetPassword() {

    const { logout } = useLogout();

    const mutation = useMutation({
        mutationFn: async (userData) => {
            const token = userData.token;
            const userId = userData.user.id;
            const password = userData.password;
            const username = userData.user.username;
            const response = await resetPassword(token, userId, password);
            if (response.statusCode === 401){
                logout();
            } else if (response.statusCode !== 201) {
                throw new Error(response.message);
            }
            return username;
        },
        onSuccess: (username) => {
            enqueueSnackbar(`Contraseña cambiada para el usuario ${username}`,{ variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message,{ variant: 'error' });
        }
    });

    return { mutation };

}