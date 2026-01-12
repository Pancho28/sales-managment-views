import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activeUser, inactiveUser } from '../services/admin.js';
import { enqueueSnackbar } from 'notistack';
import useLogout from "../../commons/hooks/useLogout.jsx";
import { Status } from "../../commons/helpers/enum.ts";

export default function useUserMutationStatus() {

    const { logout } = useLogout();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (userData) => {
            const token = userData.token;
            const userId = userData.userId;
            const currentStatus = userData.currentStatus;
            var message = '';
            if (currentStatus === Status.ACTIVE) {
                const response = await inactiveUser(token,userId);
                message = response.message;
                if (response.statusCode === 401){
                    logout();
                } else if (response.statusCode !== 201) {
                    throw new Error(response.message);
                }
            } else if (currentStatus === Status.INACTIVE) {
                const response = await activeUser(token,userId);
                message = response.message;
                if (response.statusCode === 401){
                    logout();
                } else if (response.statusCode !== 201) {
                    throw new Error(response.message);
                }
            }
            const newStatusResponse = {
                userId,
                message
            }
            return newStatusResponse;
        },
        onSuccess: (newStatusResponse) => {
            queryClient.setQueryData(
                ['users'],
                (oldUsers) => {
                    oldUsers = oldUsers.map(user => {
                        if (user.id === newStatusResponse.userId) {
                            return {
                                ...user,
                                status: user.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE
                            };
                        }
                        return user;
                    });
                    return oldUsers;
                }
            );
            enqueueSnackbar(newStatusResponse.message,{ variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message,{ variant: 'error' });
        }
    });

    return { mutation };

}