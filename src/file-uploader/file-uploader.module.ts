// Libraries
import { Module } from '@nestjs/common';

// FileUploader
import { FileUploaderController } from './file-uploader.controller';

@Module({
  controllers: [FileUploaderController],
})
class FileUploaderModule {}

export { FileUploaderModule };
