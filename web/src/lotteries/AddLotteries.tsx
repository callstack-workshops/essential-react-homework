import { Backdrop, Box, Button, Fab, Modal, Snackbar, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useToggle } from "../hooks/toggle";
import { useLotteries } from "./useLotteries";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const AddLotteries = () => {
  const { addLottery, errorAdding, resetErrorAdding } = useLotteries();

  const { isOn: isModalOpen, handleToggleOff: handleModalClose, handleToggleOn: handleModalOpen } = useToggle(false);
  const { isOn: isSnackbarOpen, handleToggleOff: handleSnackbarClose, handleToggleOn: handleSnackbarOpen } = useToggle(false);

  const formik = useFormik({
    initialValues: {
      'add-modal-name': '',
      'add-modal-prize': '',
    },
      validationSchema: Yup.object({
        'add-modal-name': Yup.string().min(4, 'Name must be at least 4 characters').required('Required'),
        'add-modal-prize': Yup.string().min(4, 'Prize must be at least 4 characters').required('Required')
      }),
    onSubmit: async (e) => {
      console.log({e})
      try {
        await addLottery({
          name: e['add-modal-name'].trim(),
          prize: e['add-modal-prize'].trim()
        })
      } catch (err) {
        // log error
        console.error(err);
        return;
      }
      handleModalClose();
      handleSnackbarOpen();
      resetErrorAdding();
      formik.handleReset(e);
    },
  });

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="add-modal-modal-title"
        aria-describedby="add-modal-modal-description"
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          <Typography id="modal__title" variant="h5" component="h2">
            Add a new lottery
          </Typography>
          
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1, mb: 1 }}>
              <TextField variant="standard" label="Lottery name" id="add-modal-name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values['add-modal-name']} helperText={formik.errors["add-modal-name"] || ''} error={!!formik.errors["add-modal-name"]} />
              </Box>
            <Box sx={{ mt: 1, mb: 1 }}>
              <TextField variant="standard" label="Lottery prize" id="add-modal-prize" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values['add-modal-prize']} helperText={formik.errors["add-modal-prize"] || ''} error={!!formik.errors["add-modal-prize"]} />
            </Box>

            <Button sx={{ mt: 2 }} variant="outlined" type="submit" disabled={formik.isSubmitting} color={errorAdding ? "error" : undefined}>
              Add
            </Button>
          </form>
        </Box>
      </Modal>

      <Fab color="primary" sx={{ position: 'absolute', bottom: 16, right: 16, cursor: 'pointer' }} variant="extended" aria-label="add lottery" onClick={handleModalOpen}>
        Add Lottery
      </Fab>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="New lottery created"
      />
    </>
  )
}