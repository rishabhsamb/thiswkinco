import React from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'

import Article from './Paper'
import PaperModal from './PaperModal'

import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

export default function Papers({ papers }) {
    const numPapers = papers.length
    const numPages = Math.ceil(numPapers / 5)
    const [activeStep, setActiveStep] = React.useState(0);
    const papersOnPage = papers.slice(activeStep * 5, (activeStep * 5 + 5))
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

    const [open, setOpen] = React.useState(false);
    const [selectedPaper, selectPaper] = React.useState({})
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
return (
    <div className="papers">
        <PaperModal open={open} paper={selectedPaper} handleClose={handleClose}/>
        <Typography className="title" variant="h4" component="h1" color="primary">
            This Week in Combinatorics and Optimization
        </Typography>
        {/* <Typography variant="h6" component="h1">
            Found {numPapers} papers
        </Typography> */}
        {papersOnPage.map((paper, i) => <Article key={i} paper={paper} onClick={() => {
            handleClickOpen()
            selectPaper(paper)}}/>)}
        
        <MobileStepper
            variant="progress"
            steps={numPages}
            position="static"
            activeStep={activeStep}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === numPages-1}>
                Next
                <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                Back
                </Button>
            }
        />



    </div>
)
}