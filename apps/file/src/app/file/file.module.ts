import { Module } from '@nestjs/common';
import { XmlService } from './xml.service';
import { XlsxService } from './xlsx.service';

@Module({
  providers: [XmlService, XlsxService],
  exports: [XmlService, XlsxService],
})
export class FileModule {}
