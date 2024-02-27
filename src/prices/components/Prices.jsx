import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';
// snackbar
import { useSnackbar } from 'notistack';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../../../common/components/Page';
import Label from '../../../common/components/Label';
import Scrollbar from '../../../common/components/Scrollbar';
import Iconify from '../../../common/components/Iconify';
import SearchNotFound from '../../../common/components/SearchNotFound';
import { CourseListHead , CourseListToolbar, CourseMoreMenu, AssignForm, AssignInstitutionForm } from '../../components';
import Dialogo from "../../../common/components/Dialogo";
// hooks
import { useCourseState } from "../../hooks/courseHook";
import { useAuthState, useAuthDispatch } from "../../../auth/hooks/authHook";
// services
import  * as API from "../../services";
// actions
import { logout } from '../../../auth/context/actions/authActions';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_course) => _course.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MyCourses() {

  // hooks

  const intl = useIntl();

  const navigate = useNavigate();

  const dispatch = useAuthDispatch();

  const { token } = useAuthState();

  const { enqueueSnackbar } = useSnackbar();

  // states

  const [openAssignDialog, setOpenAssignDialog] = useState(false); 

  const [openInstitutionDialog, setOpenInstitutionDialog] = useState(false); 

  const [courses, setCourses] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(20);

  // const table

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0;

  const filteredCourses = applySortFilter(courses, getComparator(order, orderBy), filterName);

  const isCourseNotFound = filteredCourses.length === 0;

  // methods

  const handleLogout = async () => {
    await logout(dispatch);
    navigate('/auth/login', { replace: true });
  }

  const TABLE_HEAD = [
    { 
      id: 'name', 
      label: <FormattedMessage
              id="name"
            />, 
      alignRight: false 
    },
    { 
      id: 'status', 
      label: <FormattedMessage
              id="status_user"
            />, 
      alignRight: false 
    },
    { 
      id: 'creationDate', 
      label: <FormattedMessage
              id="creation_date"
            />, 
      alignRight: false 
    },
    { 
      id: 'lastEdit', 
      label: <FormattedMessage
              id="last_edit"
            />, 
      alignRight: false 
    },
    { id: '' },
  ];

  const handleVisibilityDialog = () => {
    setOpenAssignDialog(!openAssignDialog);
  };  

  const handleInstitutionDialog = () => {
    setOpenInstitutionDialog(!openInstitutionDialog);
  }; 

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const getColorCourseStatus = ( courseStatus ) => {
    let color
    if (courseStatus.toUpperCase() === 'PUBLISHED')
      color = 'success'
    else if (courseStatus.toUpperCase() === 'DRAFT')
      color = 'primary'
    else if (courseStatus.toUpperCase() === 'PENDING')
      color = 'warning'
    return color
  }

  useEffect(() => {
    const getdatacourses = async () => {
      const response = await API.getcoursesinvolved(token);
      if (response.statusCode === 401) {
        enqueueSnackbar(
          intl.formatMessage({
            id: 'expired_session'
          })
        , { variant: 'warning' });
        handleLogout();
      } else if (response.statusCode !== 200){
        enqueueSnackbar(response.message, { variant: 'warning' });
        navigate('/menu/', { replace: true });
      }else {
        setCourses(response.courses);
      }
    }
    getdatacourses().catch(console.log);
  },[token]);

  return (
    <Page title={
      intl.formatMessage({
        id: 'courses'
      })
    }>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1} mb={2}>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage
              id="courses"
            />
          </Typography>
        </Stack>

        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1} mb={2} sx={{ ml: { xs: 1, lg: 3 } }}>
            <Button variant="contained" component={RouterLink} to="/manageCourses/createcourse" style={{ height: 25 }} 
              sx={{
                minWidth: {
                  xs: 50
                },
                minHeight: {
                  xs: 38
                },
                mt: { 
                  xs: 1.4
                }
              }}
              startIcon={<Iconify icon="eva:plus-fill"/>}
            >
              <FormattedMessage
                id="new_course"
              />
            </Button>

            <CourseListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          </Stack>
          

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size="small">
                <CourseListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={courses.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { courseCode, name, status, creationDate, lastEdit } = row;
                    
                    return (
                      <TableRow
                        hover
                        key={courseCode}
                        tabIndex={-1}
                        role="checkbox"
                      >
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={getColorCourseStatus(status)}>
                          <FormattedMessage id={status} />
                          </Label>
                        </TableCell>
                        <TableCell align="left">{creationDate}</TableCell>
                        <TableCell align="left">{lastEdit}</TableCell>

                        <TableCell align="right">
                          <CourseMoreMenu 
                            id={courseCode}
                            courseStatus={status}
                            handleVisibilityDialog={handleVisibilityDialog}
                            handleInstitutionDialog={handleInstitutionDialog}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isCourseNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[20, 10, 5]}
            component="div"
            count={courses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={
              <FormattedMessage
                id="rows_page_table"
              />
            }
          />
        </Card>
      </Container>
      {openAssignDialog && <Dialogo title={
        <FormattedMessage
          id="assign_reviewer"
        />
      } children={<AssignForm hanldeVisibility={handleVisibilityDialog}/>} />}
      {openInstitutionDialog && <Dialogo title={
        <FormattedMessage
          id="assign_institution"
        />
      } children={<AssignInstitutionForm hanldeVisibility={handleInstitutionDialog}/>} />}
    </Page>
  );
}
