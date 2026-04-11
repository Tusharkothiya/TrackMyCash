import { USER_ROLES } from "@/lib/constants/common.constants";
import bcrypt from "bcryptjs";
import mongoose, { models, Document } from "mongoose";

export interface IUserModal extends Document {
    fullName: string;
    email: string;
    password: string;
    country: string;
    role: string;
    otp: string;
    isVerified: boolean;
    welcomeEmailSent: boolean;
    welcomeEmailSentAt: Date;
    timeZone: string;
    passwordResetToken: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserModal>(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [3, 'Full name must be at least 3 characters long'],
            maxlength: [100, 'Full name must be less than 100 characters long'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
        },
        role: {
            type: String,
            enum: [ USER_ROLES.USER, USER_ROLES.ADMIN ],
            default: USER_ROLES.USER,
        },
        otp: {
            type: String,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        welcomeEmailSent: {
            type: Boolean,
            default: false,
        },
        welcomeEmailSentAt: {
            type: Date,
        },
        timeZone: {
            type: String,   
            required: [true, 'Time zone is required'],
            trim: true,
            maxlength: [100, 'Time zone must be less than 100 characters long'],
        },
        passwordResetToken:{
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
        
    }
)


userSchema.pre<IUserModal>("save", async function () {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
})

const User = models?.User || mongoose.model<IUserModal>('User', userSchema);

export default User;


