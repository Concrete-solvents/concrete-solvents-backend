import { Module } from '@nestjs/common';
import {FileUploaderController} from "./file-uploader.controller";
import {FileUploaderService} from "./file-uploader.service";

@Module({
  controllers: [FileUploaderController],
  providers: [FileUploaderService],
  exports: [FileUploaderService],
  imports: [FileUploaderService],
})
class FileUploadModule {}

export {FileUploadModule};