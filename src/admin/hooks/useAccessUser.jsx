import { useQuery } from '@tanstack/react-query';
import { getAccess } from '../../admin/services/admin';
import { enqueueSnackbar } from 'notistack';
import useLogout from '../../commons/hooks/useLogout';

export default function useAccessUser() {

    const { logout } = useLogout();

    const { isLoading, error, data, isError } = useQuery({ 
        queryKey: ['access'], 
        queryFn: async () => {
                const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
                const response = await getAccess(token);
                if (response.statusCode === 401){
                    logout();
                } else if (response.statusCode !== 200) {
                    enqueueSnackbar(response.message,{ variant: 'error' });
                }
                return response.accesses;
        }
    });

    return { isLoading, data, error, isError };

}
