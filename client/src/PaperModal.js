import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography'
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function JobModal({paper, open, handleClose}) {

    if (!paper.title) {
        return <div />
    }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-subtitle" disableTypography={true}>
            <Typography variant="subtitle1">
                {paper.title}
            </Typography>
        </DialogTitle>
        <DialogTitle id="alert-dialog-slide-subtitle" disableTypography={true}>
            <Typography variant="subtitle2">
                { paper.authors.join(', ') }
            </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
              { paper.summary }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <a href={ paper.href }>
          <Button color="primary">
            Open
          </Button>
          </a>
        </DialogActions>
      </Dialog>
    </div>
  );
}