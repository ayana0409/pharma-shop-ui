import { Collapse, Box, Typography } from '@mui/material';
import { Button } from '../ui';
import {DetailEntry} from '../ui';

function ProductDetails({ openDetails, handleAddDetail, details, handleDetailChange, handleDelete }) {

  return (
    <Collapse in={openDetails}>
      <Box
        sx={{
          margin: '20px 0',
          padding: '20px',
          border: '2px solid #14532d',
          borderRadius: '0.5rem',
        }}
      >
        <Typography variant="h6" className="text-green-900 font-bold">
          DETAILS
        </Typography>
        <div>
          <Button
            onClick={handleAddDetail}
            primary
            className="rounded-lg mb-2"
          >
            Add
          </Button>
        </div>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
          {details.map((detail, index) => (
            <DetailEntry
              key={index}
              index={index}
              id={detail.id}
              initialName={detail.name}
              initialContent={detail.content}
              onDetailChange={handleDetailChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </Box>
    </Collapse>
  );
}

export default ProductDetails;