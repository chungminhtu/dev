import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from '../config';
import { INestApplication } from '@nestjs/common';

export function initSwagger(app: INestApplication, port?: string) {
  if (config.NODE_EVN === config.PROD) return;

  const SR = config.SR;
  const configSwagger = new DocumentBuilder()
    .setTitle(SR.PRODUCT_NAME)
    .setDescription('Description document for Rest API')
    .setVersion(SR.VERSION)
    .setContact(SR.SIGNATURE, SR.SUPPORT.URL, SR.SUPPORT.EMAIL)
    .setExternalDoc('Backend overview', config.HOST + '/overview')
    .setLicense('Postman API Docs', config.API_DOC_URL)
    .addServer('http://192.168.8.127:' + String(port ?? config.PORT), 'Localhost')
    .addServer('http://localhost:4000', 'Current server')
    .addServer(config.HOST, 'Current server')
    .addServer(config.PUBLIC_IP, 'Current server throw nginx')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/apidoc', app, document);
}
