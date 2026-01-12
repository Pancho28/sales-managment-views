import { Link as RouterLink } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, List, Tooltip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

export default function ListItemsAdmin() {

return(
    <List component="nav">
      <Tooltip title="Usuarios">
        <ListItemButton component={RouterLink} to="/admin">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItemButton>
      </Tooltip>
    </List>
  );
}