import { IsBoolean } from "class-validator";

export class ApproveReport {
    @IsBoolean()
    approved: boolean;
}