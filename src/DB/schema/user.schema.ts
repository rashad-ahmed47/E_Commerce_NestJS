import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender, OTP, Provider, Role } from '../../common/enums/user.enum';

export type IHUser = HydratedDocument<User>;

@Schema({
  timestamps: true,
  strict: true,
  strictQuery: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  username!: string;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider == Provider.S;
    },
  })
  password!: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  email!: string;

  @Prop({
    type: Number,
    required: false,
  })
  age!: number;

  @Prop({
    type: Number,
    enum: Gender,
  })
  gender!: Gender;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider == Provider.S;
    },
  })
  phone!: string;

  @Prop({
    type: Number,
    enum: Provider,
  })
  provider!: Provider;

  @Prop({
    type: Boolean,
    default: false,
  })
  isEmailConfirmed!: boolean;

  @Prop({
    code: {
      type: String,
      required: false,
      minlength: 6,
      maxlength: 6,
    },
    expires: {
      type: Date,
      required: false,
    },
    type: {
      type: Number,
      default: OTP.Register,
      enum: OTP,
    },
  })
  OTP!: {
    code: string;
    expires: Date;
    type: OTP;
  };

  @Prop({
    type: String,
  })
  profilePic!: string;

  @Prop({
    type: Date,
  })
  changedCredintalsAt!: Date;

  @Prop({
    type: [String],
  })
  coverPics!: string[];

  @Prop({
    type: Number,
    enum: Role,
    default: Role.User,
  })
  role!: Role;
}

export const userSchema = SchemaFactory.createForClass(User);
export const userModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
