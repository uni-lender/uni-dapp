import { Alert, Snackbar } from '@mui/material';

export const SuccessToast = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={1000}
      onClose={onClose}
    >
      <Alert severity="success">transaction successed</Alert>
    </Snackbar>
  );
};
