import { 
    Controller,
    UseGuards,
    Body,
    Param,
    Post,
    Patch,
    Get,
    Query,
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReport } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(
        private reportsService: ReportsService
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: number, @Body() body: ApproveReport) {
        return this.reportsService.changeApproval(id, body.approved);
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDTO) {
        return this.reportsService.createEstimate(query);
    }

}
