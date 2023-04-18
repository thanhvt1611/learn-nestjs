import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDTO } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ) {}

    create(createReportDto: CreateReportDTO, user: User) {
        const report = this.repo.create(createReportDto);
        report.user = user;
        return this.repo.save(report);
    }

    async changeApproval(id: number, approved: boolean) {
        const report = await this.repo.findOneBy({id});
        if(!report) throw new NotFoundException('report not found');

        report.approved = approved;
        return this.repo.save(report);
    }

    createEstimate({ make, model, lat, lng, mileage, year }: GetEstimateDTO) {
        console.log('make:::', make);
        console.log('model:::', model);
        const estimate =  this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        .andWhere('lng - :lng BETWEEN -5 and 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 and 5', { lat })
        .andWhere('year - :year BETWEEN -3 and 3', { year })
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({mileage})
        .limit(3);
        console.log('estimate:::', estimate.getSql())
        return estimate.getRawOne();
    }
}
