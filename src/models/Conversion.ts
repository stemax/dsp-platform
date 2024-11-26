import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../utils/db';

interface Conversions {
    id: string;
    bidId: string;
    price: number;
    adId: string;
    actionType: string;
    userId: number;
}

interface ConversionsCreationAttributes extends Optional<Conversions, 'id'> {}

class Conversion extends Model<Conversions, ConversionsCreationAttributes> implements Conversions {
    public id!: string;
    public bidId!: string;
    public price!: number;
    public userId!: number;
    public actionType!: string;
    public adId!: string;
}

Conversion.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        bidId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        adId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        actionType: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'conversions',
    }
);

export default Conversion;