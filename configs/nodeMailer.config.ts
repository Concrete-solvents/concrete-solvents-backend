// Libraries
import { ConfigService } from '@nestjs/config';

const getNodeMailerConfig = async (configService: ConfigService) => ({
  transport: {
    service: 'gmail',
    auth: {
      user: configService.get<string>('MAILER_USER'),
      pass: configService.get<string>('MAILER_PASSWORD'),
    },
  },
});

export { getNodeMailerConfig };
