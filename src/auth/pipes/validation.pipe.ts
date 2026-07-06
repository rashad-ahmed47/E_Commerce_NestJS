import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CustomValidatePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      console.log('PIPE IS RUNNING');
    if (metadata.type == 'body') {
      if (value.password !== value.confirmedPassword) {
        throw new BadRequestException('passwords not match');
      }
    }
    console.log({ value, metadata });
    return value;
  }
}
