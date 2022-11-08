import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { NotifyTopic } from '@core/firebase/enums/notyfication.enum';

export class SendAllNotifyDto {
  @ApiProperty({
    example: '62d5001ca3bee2577a32ff17',
    description: '62d5001ca3bee2577a32ff17',
  })
  @IsNotEmpty()
  @IsMongoId()
  newsId: string;
}

export class SendTopicNotifyDto extends PickType(SendAllNotifyDto, ['newsId']) {
  @ApiProperty({
    example: NotifyTopic.EN,
  })
  @IsNotEmpty()
  @IsEnum(NotifyTopic)
  topic: NotifyTopic;
}

export class CreateUserNotifyDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  notifyId: string;
}

export class SubAllNotifyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tokenNotify: string;
}

export class SubTopicNotifyDto extends PickType(SubAllNotifyDto, ['tokenNotify']) {
  @ApiProperty({
    example: NotifyTopic.EN,
  })
  @IsNotEmpty()
  @IsEnum(NotifyTopic)
  topic: NotifyTopic;
}
