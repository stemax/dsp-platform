import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../utils/db';

interface AdStatsAttributes {
    id: string;
    campaignId: string;
    impressions: number;
    clicks: number;
    installs: number;
    spend: number;
    revenue: number;
}

interface AdStatsCreationAttributes extends Optional<AdStatsAttributes, 'id' | 'impressions' | 'clicks' | 'installs' | 'spend' | 'revenue'> {}

class AdStats extends Model<AdStatsAttributes, AdStatsCreationAttributes> implements AdStatsAttributes {
    public id!: string;
    public campaignId!: string;
    public impressions!: number;
    public clicks!: number;
    public installs!: number;
    public spend!: number;
    public revenue!: number;

    calculateROI() {
        return this.revenue / this.spend || 0;
    }
}

AdStats.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        campaignId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        impressions: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        clicks: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        installs: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        spend: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
        },
        revenue: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
        },
    },
    {
        sequelize,
        tableName: 'ad_stats',
    }
);

AdStats.prototype.calculateROI = function (): number {
    return this.revenue / this.spend || 0;
};
export default AdStats;
