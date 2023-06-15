import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const parsedVal = parseInt(value, 10);
    if (isNaN(parsedVal)) {
      throw new BadRequestException(
        `Validation failed. "${parsedVal}" is not an integer.`,
      );
    }
    return parsedVal;
  }
}
