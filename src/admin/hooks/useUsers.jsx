import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../admin/services/admin';
import { enqueueSnackbar } from 'notistack';
import useLogout from '../../commons/hooks/useLogout';

export default function useUsers() {

    const { logout } = useLogout();

    const { isLoading, error, data, isError } = useQuery({ 
        queryKey: ['users'], 
        queryFn: async () => {
                const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
                const response = await getUsers(token);
                if (response.statusCode === 401){
                    logout();
                } else if (response.statusCode !== 200) {
                    enqueueSnackbar(response.message,{ variant: 'error' });
                }
                return response.users;
        }
    });

    return { isLoading, data, error, isError };

}
