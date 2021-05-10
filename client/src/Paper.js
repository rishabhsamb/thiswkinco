import React from 'react'
import { Typography, Paper } from '@material-ui/core'


export default function Article({ paper, onClick }) {
    return (
        <Paper onClick={onClick} className='paper'>
            <div>
                <Typography variant='body2'>{ paper.title}</Typography>
                <Typography variant='caption'>{ paper.authors.join(', ') }</Typography>
            </div>
            <div>
                <Typography variant='caption'>{ paper.date.substring(0, 10) }</Typography>
            </div>
        </Paper>
        
    )
}
// <Typography variant='caption'>{ paper.category }</Typography>
