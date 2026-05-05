import { Backdrop, Box, Button, Fab, Modal, Snackbar, TextField, Typography } from "@mui/material";
import "./App.css";
import { useCallback, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

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

const useToggle = (defaultState = false) => {
  const [isOn, setOn] = useState(defaultState);
  const handleToggle = useCallback((on = false) => () => {
    setOn(on)
  }, [setOn])
  const handleToggleOff = handleToggle(false);
  const handleToggleOn = handleToggle(true);

  return useMemo(() => ({
    isOn,
    handleToggleOff,
    handleToggleOn
  }), [isOn, handleToggleOff, handleToggleOn]);
};

function App() {
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
    onSubmit: (e) => {
      handleModalClose();
      handleSnackbarOpen();
      formik.handleReset(e);
    },
  })

  return (
    <>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          <Typography id="modal__title" variant="h5" component="h2">
            Add a new Lottery
          </Typography>
          
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1, mb: 1 }}>
              <TextField variant="standard" label="Lottery name" id="add-modal-name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values['add-modal-name']} helperText={formik.errors["add-modal-name"] || ''} error={!!formik.errors["add-modal-name"]} />
              </Box>
            <Box sx={{ mt: 1, mb: 1 }}>
              <TextField variant="standard" label="Lottery prize" id="add-modal-prize" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values['add-modal-prize']} helperText={formik.errors["add-modal-prize"] || ''} error={!!formik.errors["add-modal-prize"]} />
            </Box>

            <Button sx={{ mt: 2 }} variant="outlined" type="submit">
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
  );
}

export default App;
