import { Backdrop, Box, Button, Fab, Modal, Snackbar, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup'

import { useToggle } from "../hooks/toggle";
import { useLotteriesToRegister } from "./useLotteriesToRegister";

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

export const RegisterForLotteries = () => {
  const { isOn: isModalOpen, handleToggleOff: handleModalClose, handleToggleOn: handleModalOpen } = useToggle(false);
  const { isOn: isSnackbarOpen, handleToggleOff: handleSnackbarClose, handleToggleOn: handleSnackbarOpen } = useToggle(false);
  const { lotteriesToRegister, registerForLotteries, clearLotteriesToRegister, errorRegistering, resetErrorRegistering } = useLotteriesToRegister();
  
  const formik = useFormik({
    initialValues: {
      'register-modal-name': '',
    },
      validationSchema: Yup.object({
        'register-modal-name': Yup.string().min(3, 'Name must be at least 3 characters').required('Required'),
      }),
    onSubmit: async (e) => {
      console.log({e})
      try {
        await registerForLotteries([...lotteriesToRegister.values()], e["register-modal-name"])
      } catch (err) {
        // log error
        console.error(err);
        return;
      }
      handleModalClose();
      handleSnackbarOpen();
      resetErrorRegistering();
      clearLotteriesToRegister();
      formik.handleReset(e);
    },
  });

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="register-modal-modal-title"
        aria-describedby="register-modal-modal-description"
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          <Typography id="modal__title" variant="h5" component="h2">
            Register for lotteries
          </Typography>
          
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1, mb: 1 }}>
              <TextField variant="standard" label="Enter your name" id="register-modal-name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values['register-modal-name']} helperText={formik.errors["register-modal-name"] || ''} error={!!formik.errors["register-modal-name"]} />
            </Box>

            <Button sx={{ mt: 2 }} variant="outlined" type="submit" disabled={formik.isSubmitting} color={errorRegistering ? "error" : undefined}>
              Register
            </Button>
          </form>
        </Box>
      </Modal>

      {!!(lotteriesToRegister.size > 0) && (
        <Fab sx={{ position: 'absolute', bottom: 16, right: 160, cursor: 'pointer' }} variant="extended" aria-label="add lottery" onClick={handleModalOpen}>
          Register
        </Fab>
      )}

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Registered to lotteries"
      />
    </>
  )
};
