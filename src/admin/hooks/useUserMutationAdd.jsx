import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from '../services/admin.js';
import { enqueueSnackbar } from 'notistack';
import useLogout from "../../commons/hooks/useLogout.jsx";

export default function useUserMutationAdd() {

    const { logout } = useLogout();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (userData) => { 
            const token = userData.token;
            delete userData.token; // remove token from userData
            const response = await createUser(token,userData);
            if (response.statusCode === 401){
                logout();
            } else if (response.statusCode !== 201) {
                throw new Error(response.message);
            }
            return response.user;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(
                ['users'],
                (oldUsers) => {
                    // si no hay usuarios devuelve el nuevo como un array
                    if (!oldUsers) return [user]
                    // si hay usuarios, agrega el nuevo al array existente
                    return [...oldUsers, user]
                }
            );
            enqueueSnackbar('Usuario creado con éxito',{ variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message,{ variant: 'error' });
        }
    });

    return { mutation };

}