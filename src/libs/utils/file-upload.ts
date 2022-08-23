// Libraries
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

const editFileName = (req, file, callback) => {
  callback(
    null,
    file.fieldname + '-' + Date.now() + extname(file.originalname),
  );
};

export { editFileName, imageFileFilter };
