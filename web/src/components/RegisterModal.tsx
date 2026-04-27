import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from '@mui/material';

type Props = {
  open: boolean;
  selectedIds: string[];
  onClose: () => void;
  onSuccess: () => void;
};

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const API_URL = import.meta.env.VITE_API_URL as string;

function RegisterModal({ open, selectedIds, onClose, onSuccess }: Props) {
  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async ({ name }, { resetForm }) => {
      await Promise.all(
        selectedIds.map((lotteryId) =>
          fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lotteryId, name }),
          }),
        ),
      );
      resetForm();
      onSuccess();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle} component="form" onSubmit={formik.handleSubmit}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Register for a lottery
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          label="Enter your name"
          {...formik.getFieldProps('name')}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
          startIcon={
            formik.isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
        >
          REGISTER
        </Button>
      </Box>
    </Modal>
  );
}

export default RegisterModal;
