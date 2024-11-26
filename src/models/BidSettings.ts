import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../utils/db';

interface BidSettingsAttributes {
    id: string;
    geo: string;
    category: string;
    baseCpm: number;
    multiplier: number;
}

interface BidSettingsCreationAttributes extends Optional<BidSettingsAttributes, 'id'> {}

class BidSettings extends Model<BidSettingsAttributes, BidSettingsCreationAttributes> implements BidSettingsAttributes {
    public id!: string;
    public geo!: string;
    public category!: string;
    public baseCpm!: number;
    public multiplier!: number;
}

BidSettings.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        geo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        baseCpm: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        multiplier: {
            type: DataTypes.FLOAT,
            defaultValue: 1.0,
        },
    },
    {
        sequelize,
        tableName: 'bid_settings',
    }
);

export default BidSettings;
