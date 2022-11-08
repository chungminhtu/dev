import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

// CORE
import { config } from '@core/config';
import { ApiHideProperty, ApiProperty, enumProperty } from '@core/docs';

// SHARED
import { EUserState } from '@shared/enum/user.enum';
import { ERole } from '@shared/enum/role.enum';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
  delete ret.password;
}

const options = {
  virtuals: true,
  versionKey: false,
  transform: transformValue,
};

export interface IUserSchemas extends Document {
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  setPassword: (password: string) => Promise<string>;
  comparePassword: (password: string) => Promise<string>;
}

export const UserSchema = new Schema<IUserSchemas>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email can not be empty'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email should be valid',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password can not be empty'],
      minlength: [6, 'Password should include at least 6 chars'],
    },
  },
  {
    timestamps: true,
    toObject: options,
    toJSON: options,
  },
);

UserSchema.methods.setPassword = (password: string): Promise<string> => {
  return bcrypt.hashSync(String(password), config.PASSWORD_SALT);
};

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await this.setPassword(this.password);
  next();
});
