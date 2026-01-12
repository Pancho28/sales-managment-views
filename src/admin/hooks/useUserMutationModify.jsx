import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyUser } from '../services/admin.js';
import { enqueueSnackbar } from 'notistack';
import useLogout from "../../commons/hooks/useLogout.jsx";

export default function useUserMutationModify() {

    const { logout } = useLogout();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (userData) => { 
            const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
            const userId = userData.userId;
            delete userData.userId;
            const response = await modifyUser(token,userId,userData);
            if (response.statusCode === 401){
                logout();
            } else if (response.statusCode !== 200) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (modifyUserResponse) => {
            queryClient.setQueryData(
                ['users'],
                (oldUsers) => {
                    // si no hay usuarios devuelve el nuevo como un array
                    if (!oldUsers) return [modifyUserResponse.user]
                    // si hay usuarios, buscar al usuario a modificar y actualizarlo
                    return oldUsers.map(user => {
                        if (user.id === modifyUserResponse.user.id) {
                            return {
                            ...user,
                            email: modifyUserResponse.user.email,
                            username: modifyUserResponse.user.username,
                            tz: modifyUserResponse.user.tz,
                            local: [{
                                name: modifyUserResponse.user.local.name,
                                dolar: modifyUserResponse.user.local.dolar
                            }]
                            }

                        }
                        return user;
                    });

                }
            );
            enqueueSnackbar(modifyUserResponse.message,{ variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message,{ variant: 'error' });
        }
    });

    return { mutation };

}