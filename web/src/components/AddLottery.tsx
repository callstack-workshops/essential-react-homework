import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const validationSchema = yup.object({
  name: yup.string().min(4, 'name must be at least 4 characters').required(),
  prize: yup.string().min(4, 'prize must be at least 4 characters').required(),
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

function AddLottery({ open, onClose, onSuccess }: Props) {
  const formik = useFormik({
    initialValues: { name: '', prize: '' },
    validationSchema,
    onSubmit: async (_values, { resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
          Add a new lottery
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          label="Lottery name"
          {...formik.getFieldProps('name')}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="standard"
          label="Lottery prize"
          {...formik.getFieldProps('prize')}
          error={formik.touched.prize && !!formik.errors.prize}
          helperText={formik.touched.prize && formik.errors.prize}
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
          ADD
        </Button>
      </Box>
    </Modal>
  );
}

export default AddLottery;
